import {spawn, execSync} from 'child_process'
import puppeteer from 'puppeteer'
import path from 'path'

describe('Booklet', function() {
  beforeAll(async () => {
    execSync('npm link booklet-ui')
    execSync('npm install')
    execSync('npm run build')
    return new Promise((resolve) => {
      console.log('beforeAll')
      this.server = spawn('./node_modules/.bin/serve',['build'],{cwd : path.join(__dirname, '..')})
      console.log("server spawn")
      this.server.stdout.on('data',async d => {
        console.log(d.toString())
        if (d.toString().indexOf('Running') >= 0){
          this.browser = await puppeteer.launch({headless : false})
          console.log('resolve before')
          resolve()
        } 
      })
    })

  })

  afterAll(async () => {
    return new Promise((resolve) => {
      this.server.on('exit',async () => {
        await this.browser.close()
        resolve()
      })
      this.server.kill()
    })

  })

  it('is truthy', async () => {
    const page = await this.browser.newPage()
    await page.goto('http://localhost:5000')

  });
});
