const { htmlToJats } = require('../jatsUtils')

describe('htmlToJats', () => {
  test('yyyy-mm-dd', () => {
    expect(
      htmlToJats(`
<blockquote>
  <p class="paragraph">
    Some <strong><em>
      <a href="" rel="" target="blank">
        <a href="https://www.google.com" rel="" target="blank">
          linked
        </a>
      </a>
    </em></strong> text <u>fadfadfas</u>
  </p>
  <p class="paragraph">
    <span class="small-caps">
      fadffd
    </span>
  </p>
  <p class="paragraph">
    vzxvzcvcv<sub>zvxvcv</sub><sup>zcvcvzvcz</sup>
  </p>
  <p class="paragraph">
    inline math: <math-inline class="math-node"> x^2 + y^2 = z^2 </math-inline>
  </p>
  <math-display class="math-node">1 + 1 = x^2 / x^3</math-display>
</blockquote>`),
    ).toEqual(`
<disp-quote>
  <p>
    Some <bold><italic>
      
        <ext-link ext-link-type="uri" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://www.google.com">
          linked
        </ext-link>
      
    </italic></bold> text <underline>fadfadfas</underline>
  </p>
  <p>
    <sc>
      fadffd
    </sc>
  </p>
  <p>
    vzxvzcvcv<sub>zvxvcv</sub><sup>zcvcvzvcz</sup>
  </p>
  <p>
    inline math: <inline-formula><tex-math><![CDATA[\\displaystyle  x^2 + y^2 = z^2 ]]></tex-math></inline-formula>
  </p>
  <p><inline-formula><tex-math><![CDATA[\\displaystyle 1 + 1 = x^2 / x^3]]></tex-math></inline-formula></p>
</disp-quote>`)
  })
})
