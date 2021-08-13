import {
  Provide,
  Inject,
  ServerlessTrigger,
  ServerlessTriggerType,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/faas';
import * as puppeteer from 'puppeteer';

@Provide()
export class HelloHTTPService {
  @Inject()
  ctx: Context;

  @ServerlessTrigger(ServerlessTriggerType.HTTP, {
    path: '/',
    method: 'get',
  })
  async handleHTTPEvent(@Query() name = 'midwayjs') {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    });

    let url = 'https://www.baidu.com';

    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = 'http://' + url;
    }

    const page = await browser.newPage();

    await page.emulateTimezone('Asia/Shanghai');
    await page.goto(url, {
      'waitUntil': 'networkidle2'
    });
    return `Hello ${name}`;
  }
}
