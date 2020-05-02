import styled from '@emotion/styled';

type HeaderImageProps = {
  src: string;
}

const HeaderImage = styled.div`
  max-height: 100vh;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${(props: HeaderImageProps): string => props.src});
`;

export default HeaderImage;
