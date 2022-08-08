import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import puppeteer from 'puppeteer';
import { AuthDocument } from '../schemas/auth.schema';
import { Organization } from '../schemas/organization.schema';
import { ScrappedProfile, ScrappedAccount } from '../types';
import { AuthService } from './auth.service';
import { FormatterService } from './formatter.service';
import { OrganizationService } from './organization.service';

@Injectable()
export class ScrapperService {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly organizationService: OrganizationService,
    private readonly formatterService: FormatterService,
  ) {}

  private async initialize() {
    if (process.env.NODE_ENV === 'production') {
      this.browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-gpu'],
      });
    } else {
      this.browser = await puppeteer.launch({
        headless: false,
        args: ['--incognito'],
      });
    }
    this.page = await this.browser.newPage();
    this.page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });
  }

  async scrape(organizationId: string, customerId: string, limit?: number) {
    try {
      const organization = await this.organizationService.fetchOrganization(
        organizationId,
      );
      if (!organization) {
        throw new NotFoundException('organization not found');
      }
      const auth = await this.authService.fetchAuth(organizationId, customerId);
      if (!auth) {
        throw new NotFoundException('credentials not found');
      }
      await this.initialize();
      await this.scrapeLogin(organization, auth);
      await this.scrapeOtp();
      const profile = await this.scrapeProfile();
      let accounts = await this.scrapeAccounts();
      accounts = await this.scrapeTransactions(accounts, limit);
      await this.scrapeLogout();
      await this.browser.close();
      return this.formatterService.format({
        profile,
        accounts,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('unable to finish scrape process');
      // TODO: add error catching - sentry?
    }
  }

  async scrapeLogin(
    organization: Organization & { id: string },
    auth: AuthDocument,
  ): Promise<void> {
    await this.page.goto(organization.loginUrl, {
      waitUntil: 'networkidle0',
    });
    await this.page.waitForSelector('#email');
    await this.page.waitForSelector('#password');
    await this.page.waitForSelector('button[type=submit]');
    await this.page.type('#email', auth.username, { delay: 100 });
    await this.page.type('#password', auth.password, { delay: 100 });
    await this.page.click('button[type=submit]');
    await this.page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
  }

  async scrapeOtp(): Promise<void> {
    await this.page.waitForSelector('#otp');
    await this.page.waitForSelector('button[type=submit]');
    await this.page.type('#otp', '12345', { delay: 100 }); // TODO: dynamic otps??
    await this.page.click('button[type=submit]');
    await this.page.waitForNavigation({
      waitUntil: 'networkidle0',
    });
  }

  async scrapeProfile(): Promise<ScrappedProfile> {
    await this.page.waitForSelector('main > div > div > p');
    const [address, bvn, phoneNumber, email] = await this.page.$$eval(
      'main > div > div > p',
      (elements) =>
        elements.map((element) => element.textContent.split(': ').pop()),
    );
    await this.page.waitForSelector('button');
    await this.page.click('button');
    await this.page.waitForSelector('input[type=text]');
    const [firstName, lastName] = await this.page.$$eval(
      'input[type=text]',
      (elements) =>
        elements.map((element) => element.getAttribute('placeholder')),
    );
    return { firstName, lastName, address, bvn, phoneNumber, email };
  }

  async scrapeAccounts(): Promise<ScrappedAccount[]> {
    await this.page.waitForSelector('section > section');
    const accounts = await this.page.$$eval('section > section', (elements) =>
      elements.map((element) => {
        const accountName = element.querySelector('h3').textContent;
        const accountNumber = element
          .querySelector('a')
          .getAttribute('href')
          .split('-')
          .pop();
        const [currency, availableBalance] = element
          .querySelectorAll('p')[0]
          .textContent.split(' ');
        const [_, ledgerBalance] = element
          .querySelectorAll('p')[1]
          .textContent.split(' ');
        return {
          accountName,
          availableBalance,
          currency,
          ledgerBalance,
          accountNumber,
        };
      }),
    );
    return accounts;
  }

  async scrapeTransactions(
    accounts: ScrappedAccount[],
    limit: number,
  ): Promise<ScrappedAccount[]> {
    const selector = `section > section:nth-child(2) > div:nth-child(2) > a`;
    await this.page.waitForSelector(selector);
    let counter = 0;
    while (accounts.length > counter) {
      const selector = `section > section:nth-child(${
        2 + counter
      }) > div:nth-child(2) > a`;
      await this.page.waitForSelector(selector);
      await this.page.click(selector);
      await this.page.waitForSelector('table');
      await this.page.waitForSelector(
        'section > div:nth-child(4) > div > button:nth-child(2)',
      ); // next button
      await this.page.waitForSelector(
        'section > div:nth-child(4) > span > span:nth-child(3)',
      ); // total entries
      const totalTransactions = await this.page.$eval(
        'section > div:nth-child(4) > span > span:nth-child(3)',
        (element) => element.textContent,
      );
      let transactions = [];
      const condition = () => {
        if (limit) {
          return transactions.length <= limit;
        }
        return transactions.length !== totalTransactions.length;
      };
      while (condition()) {
        await this.page.waitForSelector('table tbody tr');
        const result = await this.page.$$eval('table tbody tr', (rows) => {
          return rows
            .filter((row) => row.children.length)
            .map((row) => {
              const type = row.querySelector('th').innerText;
              const [
                date,
                description,
                amount,
                beneficiaryAccountNumber,
                senderAccountNumber,
              ] = Array.from(
                row.querySelectorAll('td'),
                (column) => column.innerText,
              );
              const currency = Array.from(amount)[0];
              return {
                type,
                date,
                description,
                amount: amount.substring(1),
                beneficiaryAccountNumber,
                senderAccountNumber,
                currency,
              };
            });
        });
        transactions = [...transactions, ...result];
        await this.page.click(
          'section > div:nth-child(4) > div > button:nth-child(2)',
        );
      }
      if (limit) {
        while (transactions.length > limit) {
          transactions.pop();
        }
      }
      accounts[counter]['transactions'] = transactions;
      await this.page.goBack();
      counter++;
    }
    return accounts;
  }

  async scrapeLogout(): Promise<void> {
    await this.page.click('nav > div > a:nth-child(2)');
  }
}
