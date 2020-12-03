import { NextPage } from 'next'

import withLayout from '../components/withLayout'

const Goodbye: NextPage = (): React.ReactElement => {
  return (
    <div className="p-5 container mx-auto text-2xl space-y-8">
      <p>Were you expecting to find something else?</p>

      <p>Us too.</p>

      <p>
        Earlier this year we left our jobs to chase a vision. A vision where the
        great content creators of the web would be compensated for their work.
        Instead of focusing on marketing, social media, or popularity contests,
        they could write about what they are passionate about. The things that
        keep them up at night. And in return? Those of us looking for great
        content would reward the creators directly.
      </p>

      <p>
        We still believe in this vision. You can see aspects of it all over the
        internet. Bard is no longer part of those pushing to help the creators.
        <strong>We failed.</strong>
      </p>

      <p>
        We failed to get our product in front of the people. We failed to
        support the writers the way they needed us to. We failed to stick to our
        vision and believe in ourselves. For all of those reasons, we are sorry.
      </p>

      <p>
        For those we let down, we hope you find a place on the internet where
        you are compensated in the way you deserve. Never give up on your
        vision.
      </p>

      <p>Godspeed.</p>
    </div>
  )
}

export default withLayout(Goodbye)
