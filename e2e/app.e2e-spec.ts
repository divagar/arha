import { ArhaPage } from './app.po';

describe('arha App', () => {
  let page: ArhaPage;

  beforeEach(() => {
    page = new ArhaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
