import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

const OpenLetter: NextPage = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="flex flex-col justify-between container mx-auto px-10 lg:px-5">
      <header>
        <nav className="py-10 flex justify-between">
          <Link href="/">
            <a className="logo font-extrabold text-5xl text-primary z-10 font-serif">
              bard.
            </a>
          </Link>
        </nav>
      </header>

      <section className="sm:text-xl xl:text-2xl mb-4">
        <p className="mb-8">Something about writing online just isn't right. The internet has changed the way we consume content, but not all change is positive. Advertising revenues have created a system that rewards tactics like clickbaiting and content splitting — and as long as they increase page hits, these tactics work and will continue to be used.</p>
        <p className="mb-8">While this is frustrating and creates a poor experience for readers, it would be almost be forgivable if quality content was rewarded in proportion to the value it generated.</p>
        <p className="mb-8">But this isn't the case.</p>
        <p className="mb-8">A writer today could write an article for a publication that goes viral, without getting any piece of the value generated.</p>
        <p className="mb-8">Not ideal, but at least they were paid to write the article.</p>
        <p className="mb-8">So let's assume they were independent, as most writers online are, and that they published it on their own blog. Their article could have travelled millions of times to the end of the world and back, but without numerous ways to try to capture that value — either by upselling some product they've had to create or by monetizing a newsletter — that value is lost once again.</p>
        <p className="mb-8">And then there is the most likely outcome: that nobody saw the article at all. Because the writer who wants to focus on their writing had to figure out how to set up a website by the time they got around to writing, they realized how difficult it was to drive traffic when they didn't have an existing following.</p>
        <p className="mb-8 font-bold">This is the current system.</p>
        <p className="mb-8 font-bold">We don't like it.</p>
        <p className="mb-8">We believe quality writing should be rewarded in proportion to the value generated.</p>
        <p className="mb-8">We believe writers should be incentivized to provide the most value they can, rather than to play with silly marketing tactics.</p>
        <p className="mb-8">We believe writers should be able to focus on their writing, rather than having to create websites, products, or services they aren't passionate about simply because they need to make a living.</p>
        <p className="mb-8 font-bold">What if writing wasn't a means to an end, but an end in itself?</p>
        <p className="mb-8">Because we don't like the current system, we're going to flip it on its head.</p>
        <p className="mb-8 font-bold">We want to take the power from the advertisers and publications and give it to the readers.</p>
        <p className="mb-8">We want the readers to decide where they are getting value.</p>
        <p className="mb-8">And to reward those writers accordingly.</p>
        <p className="mb-8">We want new writers who, through trial, error, and gradual improvement, find a niche that is as passionate about them as they are passionate about it. Where their readers are so excited to have someone writing about their esoteric and unique hobby that paying a small amount to support the writer is worth every penny.</p>
        <p className="mb-8">We want the niche hobby writers who have only a few dozen passionate followers to not only survive but to thrive.</p>
        <p className="mb-8">And we want large, successful writers to focus on what they really want to write about and know that their writing is enough, without having to create products or services they're not passionate about.</p>
        <p className="mb-8 font-bold">We want to change the industry.</p>
        <p className="mb-8 font-bold">And we want you to join us.</p>
      </section>

      <section className="container mx-auto md:px-40 pt-10 pb-40 text-center">
        <h2 className="font-bold text-4xl pb-5 text-primary font-serif">Join the writing revolution today.</h2>

        <form action="https://getbard.us4.list-manage.com/subscribe/post?u=86d9490b3d050660444e895dd&amp;id=bf0fd8d2e4" method="post" id="mc-embedded-subscribe-form2" name="mc-embedded-subscribe-form" target="_blank" noValidate>
          <input name="EMAIL" type="email" value={email} onChange={e => setEmail(e.target.value)} id="mce-EMAIL2" className="bg-snow border border-platinum px-4 py-3 rounded w-full lg:w-3/4 mr-2 mb-4" placeholder="ernest@hemingway.com" required />
          <div style={{ position: 'absolute', left: -5000 }} aria-hidden="true"><input type="text" name="b_86d9490b3d050660444e895dd_bf0fd8d2e4" tabIndex={-1} defaultValue="" /></div>
          <input type="submit" className="bg-primary hover:bg-secondary px-4 py-3 text-snow rounded font-serif w-full lg:w-auto" value="Keep Me Posted" />
        </form>
      </section>
    </div>
  );
}

export default OpenLetter;
