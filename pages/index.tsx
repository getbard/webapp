import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import styled from '@emotion/styled';

const Container = styled.div`
  &:after {
    content: "";
    background-image: url(../blob-secondary.svg);
    opacity: 0.18;
    top: -90vh;
    left: -5vw;
    bottom: 0;
    right: -40vw;
    position: absolute;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
  }
`;

const Index: NextPage = (): React.ReactElement => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => setEmail(e.target.value);

  return (
    <Container className="overflow-x-hidden relative">
      {/* Hero */}
      <div className="min-h-screen flex flex-col justify-between container mx-auto px-10 lg:px-5">
        <nav className="py-10 flex flex-col sm:flex-row justify-between sm:items-center">
          <Link href="/">
            <a className="logo font-extrabold text-5xl text-primary z-10 font-serif">
              bard.
            </a>
          </Link>

          <Link href="/open-letter">
            <a className="text-2xl text-primary">
              An Open Letter
            </a>
          </Link>
        </nav>

        <section className="flex items-center pb-20 md:pb-48">
          <div className="md:w-1/2 inline-block z-10">
            <h1 className="font-bold text-3xl xl:text-4xl inline font-serif">Quality writing rarely earns you cash.</h1> <h1 className="font-extrabold text-3xl xl:text-4xl inline text-primary font-serif">Until now.</h1>

            <p className="text-xl xl:text-2xl text-gray-800 my-10">Whether you have a large audience, starting from scratch, or something in-between, we let you focus on writing — we handle the rest.</p>

            <form action="https://getbard.us4.list-manage.com/subscribe/post?u=86d9490b3d050660444e895dd&amp;id=bf0fd8d2e4" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" target="_blank" noValidate>
              <input name="EMAIL" type="email" value={email} onChange={handleEmailChange} id="mce-EMAIL" className="bg-snow border border-platinum px-4 py-3 rounded w-full xl:w-3/4 mr-2 mb-4 inline-block" placeholder="ernest@hemingway.com" required />
              <div style={{ position: 'absolute', left: -5000 }} aria-hidden="true"><input type="text" name="b_86d9490b3d050660444e895dd_bf0fd8d2e4" tabIndex={-1} defaultValue="" /></div>
              <input type="submit" className="bg-primary hover:bg-secondary px-4 py-3 text-snow rounded font-serif w-full xl:w-auto" value="Keep Me Posted" />
            </form>
          </div>

          <div className="md:w-1/2">
            <img src="/woman-writer.svg" alt="woman writing" className="hidden md:inline-block" />
          </div>
        </section>
      </div>

      <section className="bg-primary text-snow lg:w-11/12 mx-auto z-10 flex flex-col md:flex-row">
        <div className="pt-20 xl:pt-40 py-10 md:py-20 xl:py-40 px-10 xl:px-20 z-10 bg-primary md:w-1/3 md:inline-block">
          <h2 className="font-bold text-2xl xl:text-4xl pb-5 font-serif">Quality Over Quantity</h2>
          <p className="text-xl xl:text-2xl">Get rewarded based on the value you provide, not on how many clicks you get. The end of clickbait has arrived.</p>
        </div>

        <div className="py-10 md:py-20 xl:py-40 px-10 xl:px-20 z-10 bg-primary md:w-1/3 md:inline-block">
          <h2 className="font-bold text-2xl xl:text-4xl pb-5 font-serif">We Got Your Back</h2>
          <p className="text-xl xl:text-2xl">We give you the tools you need to thrive. Forget about setting up a website or newsletters. Focus on your writing.</p>
        </div>

        <div className="pb-20 xl:pb-40 py-10 md:py-20 xl:py-40 px-10 xl:px-20 z-10 bg-primary md:w-1/3 md:inline-block">
          <h2 className="font-bold text-2xl xl:text-4xl pb-5 font-serif">Your Audience</h2>
          <p className="text-xl xl:text-2xl">Reach new readers who are hungry for quality content and eager to reward it.</p>
        </div>
      </section>

      <section className="container mx-auto px-10 py-20 sm:py-20 lg:p-48 text-center z-10">
        <h2 className="font-bold text-3xl xl:text-4xl pb-5 text-primary font-serif">Join the writing revolution today.</h2>

        <form action="https://getbard.us4.list-manage.com/subscribe/post?u=86d9490b3d050660444e895dd&amp;id=bf0fd8d2e4" method="post" id="mc-embedded-subscribe-form2" name="mc-embedded-subscribe-form" target="_blank" noValidate>
          <input name="EMAIL" type="email" value={email} onChange={handleEmailChange} id="mce-EMAIL2" className="bg-snow border border-platinum px-4 py-3 rounded w-full lg:w-3/4 mr-2 mb-4" placeholder="ernest@hemingway.com" required />
          <div style={{ position: 'absolute', left: -5000 }} aria-hidden="true"><input type="text" name="b_86d9490b3d050660444e895dd_bf0fd8d2e4" tabIndex={-1} defaultValue="" /></div>
          <input type="submit" className="bg-primary hover:bg-secondary px-4 py-3 text-snow rounded font-serif w-full lg:w-auto" value="Keep Me Posted" />
        </form>
      </section>

      <footer className="bg-gunmetal text-snow p-20 flex items-end justify-between z-10">
        <div>
          <div className="font-bold font-serif">Questions?</div>
          <div>Get in touch at <a className="text-secondary hover:text-platinum" href="mailto:hello@getbard.com">hello@getbard.com</a></div>
        </div>

        <div className="text-right hidden md:block">
          <div className="font-serif">The pen is mightier than the sword.</div>
        </div>
      </footer>
    </Container>
  )
}

export default Index;