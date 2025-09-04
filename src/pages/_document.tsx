import { getDirection } from '@/lib/constants'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx)
  }
  render() {
    const { locale } = this.props.__NEXT_DATA__
    const dir = getDirection(locale)
    return (
      <Html dir={dir}>
        <Head>
          {/* <script
            async
            src="https://static.mywot.com/website_owners_badges/websiteOwnersBadge.js"
          ></script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
