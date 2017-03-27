# js-auto-test
The purpose of `js-auto-test` is to provide some scaffolding on top of [protractor](http://www.protractortest.org/) to follow the Page Object pattern for Automated UI tests. The Library contains some classes to help structure and automate your tests. The [CLI](https://www.npmjs.com/package/js-auto-test-cli) provides a simple way to run tests with either the default [config](./conf/config.js), environment variables, or override with your own config.

## Library
The library consists of two main classes: [Fragment](./src/js/Fragment.js) and [Sequence](./src/js/Sequence.js).

A Fragment is a group of HTML that can be tested. For instance, a top level navigation bar is a reusable group of HTML that could show up on many pages. It can be used as a shared Fragment component that can be associated with other Fragments. If you have unique content on the home page, you can make a home page Fragment that is associated with your navigation Fragment above. The purpose of a Fragment is for testing its elements and optionally performing actions against its elements.
- ***NOTE:*** Action methods will need to be added per use case, [requests](https://github.com/aeilers/js-auto-test/issues) for common Actions are welcome. ([element api](http://www.protractortest.org/#/api?view=ElementFinder))

A Sequence defines the steps an automated UI test specification needs to perform. It is also responsible to setting the entry point to the test sequence. It provides a Fragment cache to reference for each step in the sequence that will need to be defined. I've started out with some basics and will be adding more over time (and open to [requests](https://github.com/aeilers/js-auto-test/issues)).

### Example
Here is a simple example of an implementation using `js-auto-test`. When testing a larger site with many tests, you will want to consider some structure around your code. I've added a suggested minimal folder structure below. I have also created a [starter kit](https://github.com/aeilers/docker-auto-test-starter) that contains the basic structure below with additional support scripts and environment/execution specifics.
- `./fragments/HomeFragment.js`
  ```javascript
  import { Fragment } from 'js-auto-test';

  const LINK_SELECTOR = 'a.link';


  export default class HomeFragment extends Fragment {

      constructor(fragments) {
          super(fragments);

          this.setElement(LINK_SELECTOR);
      }

      async testElements() {
          await super.testElements();

          await this.expect(this.getElement(LINK_SELECTOR).getText()).to.eventually.equal('some text');
      }

      async clickLink() {
          await this.getElement(LINK_SELECTOR).click();
      }

  }
  ```

- `./sequences/HomeSequence.js`
  ```javascript
  import { Sequence } from 'js-auto-test';

  import HomeFragment from '../fragments/HomeFragment';


  export default class HomeSequence extends Sequence {

      constructor() {
          super();

          this.setFragment('home', new HomeFragment());

          this.setStep(this.getFragment('home').testElements);
          this.setStep(this.getFragment('home').clickLink);
      }

      async runSequence() {
          this.setStep(this.getUrl('/'));

          super.runSequence();
      }

  }
  ```

- `./specs/home.spec.js`
  ```javascript
  import HomeSequence from '../sequences/HomeSequence';

  describe('home page test', () => {
      let homeSequence;

      before() {
          homeSequence = new HomeSequence();
      }

      it('expects to see "some text" on the home page', async () => {
          await homeSequence.runSequence();
      });

      after() {
          homeSequence = null;
      }
  });
  ```

## Environment variables
Below is a table describing the possible environment variable or `conf/config.js` overrides if desired. This option works great if using the standard setup within a Docker container.

Name                    | Type    | Default
----------------------- | ------- | --------------------------------
DIRECT_CONNECT          | Boolean | false
SELENIUM_URL            | String  | 'http://localhost:4444/wd/hub'
TEST_BROWSER_NAME       | String  | 'phantomjs'
TEST_BROWSER_VERSION    | String  | 'ANY'
HTTP_PROTOCOL           | String  | 'http://'
HTTP_HOST               | String  | 'localhost'
HTTP_PORT               | String  | 3000

## Future
- unit tests!
- additional functionality for common tests and actions
- requests via [issues](https://github.com/aeilers/js-auto-test/issues)
