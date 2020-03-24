import styled from '@emotion/styled';

type HeaderImageProps = {
  url: string;
}

const HeaderImage = styled.div`
  height: 28rem;
  background-size: cover;
  background-position: center;
  background-image: url(${(props: HeaderImageProps): string => props.url});
`;

export default HeaderImage;
