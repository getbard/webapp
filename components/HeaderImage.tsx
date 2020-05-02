import styled from '@emotion/styled';

type HeaderImageProps = {
  url: string;
}

const HeaderImage = styled.div`
  width: 100vw;
  height: 100vh;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${(props: HeaderImageProps): string => props.url});
`;

export default HeaderImage;
