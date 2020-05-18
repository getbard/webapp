import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiShare, FiMail } from 'react-icons/fi';
import { FaFacebookSquare, FaTwitterSquare, FaLinkedin } from 'react-icons/fa';

import { Article } from '../generated/graphql';

import Modal from './Modal';
import Button from './Button';

type FormData = {
  donationAmount: number;
};

function ShareArticleButton({
  article,
  minimal,
}: {
  article: Article;
  minimal?: boolean;
}): React.ReactElement {
  const router = useRouter();
  const [displayShareModal, setDisplayShareModal] = useState(false);
  const authorName = `${article.author.firstName}${article.author?.lastName && ' ' + article.author.lastName[0] + '.'}`;

  const shareUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://getbard.com${router.asPath}`;

  const shareText = `I just read ${article.title} by ${authorName} on`;
  const shareTextTwitter = `${shareText} @GetBardOfficial!`;
  const shareTextLinkedIn = `${shareText} @getbard!`;
  const shareTextEmail = `${shareText} Bard! You can read it here: ${shareUrl}`;

  const trackingData = {
    authorId: article.author.id,
    page: router.asPath,
  };

  const handleClick = (): void => {
    window.analytics.track('SHARE ARTICLE BUTTON: Icon clicked', trackingData);
    setDisplayShareModal(true);
  }

  return (
    <>
      {
        minimal
         ? (
          <div
            title="Share article"
            className="text-lg flex justify-center align-center hover:text-primary hover:cursor-pointer"
            onClick={handleClick}
          >
            <FiShare />
          </div>
         )
         : (
          <Button secondary onClick={handleClick}>
            Share this article&nbsp;<FiShare />
          </Button>
         )
      }

      <Modal open={displayShareModal} onModalClose={(): void => setDisplayShareModal(false)}>
        <h2 className="text-lg mb-2">
          Share <span className="font-bold">{article.title}</span>
        </h2>

        <div className="text-4xl flex justify-around items-center">
          <a
            className="hover:text-primary hover:cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          >
            <FaFacebookSquare />
          </a>

          <a
            className="hover:text-primary hover:cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTextTwitter}`}
          >
            <FaTwitterSquare />
          </a>

          <a
            className="hover:text-primary hover:cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
            href={`http://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTextLinkedIn}`}
          >
            <FaLinkedin />
          </a>

          <a
            className="hover:text-primary hover:cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:?body=${shareTextEmail}&subject=${article.title}`}
          >
            <FiMail />
          </a>
        </div>

      </Modal>
    </>
  );
}

export default ShareArticleButton;
