import Link from 'next/link';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  & a:hover {
    color: #616161 !important;
  }
`;

function Footer(): React.ReactElement {
  return (
    <FooterContainer className="bg-gunmetal text-snow p-10 z-10">
      <div className="md:w-1/2 mx-auto flex justify-between pb-5">
        <Link href="/about">
          <a>
            About
          </a>
        </Link>

        <Link href="/faq">
          <a>
            FAQ
          </a>
        </Link>

        <Link href="/privacy">
          <a>
            Privacy
          </a>
        </Link>

        <Link href="/terms">
          <a>
            Terms
          </a>
        </Link>
      </div>

      <div className="flex items-end justify-between pt-5 border-t border-gray-700">
        <div>
          <div className="font-bold font-serif">Questions?</div>
          <div>Get in touch at <a className="text-secondary hover:text-platinum" href="mailto:hello@getbard.com">hello@getbard.com</a></div>
        </div>

        <div className="text-right hidden md:block">
          <div className="font-bold font-serif">© 2020 Bard</div>
          <div className="font-serif">The pen is mightier than the sword.</div>
        </div>
      </div>
    </FooterContainer>
  );
}

export default Footer;
