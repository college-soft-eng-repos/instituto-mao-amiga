import { useWindowDimensions, type ViewStyle } from 'react-native';

/**
 * Issue #06 — responsividade por resolução.
 * Celular: quase 100% da largura (com padding).
 * Tablet (≥ 768): ~92%, teto 840px.
 * Desktop (≥ 1024): ~88%, teto 1100px — usa bem a tela sem colar nas bordas.
 */
export function useConteudoResponsivo(): {
  width: number;
  isWide: boolean;
  conteudoStyle: ViewStyle;
} {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  let contentWidth: number | `${number}%` = '100%';
  let maxWidth = width;
  let paddingHorizontal = 16;

  if (isDesktop) {
    // Desktop: aproveita a largura (antes o teto 560px deixava uma fileirinha no meio)
    contentWidth = Math.min(width * 0.88, 1100);
    maxWidth = 1100;
    paddingHorizontal = 32;
  } else if (isTablet) {
    contentWidth = Math.min(width * 0.92, 840);
    maxWidth = 840;
    paddingHorizontal = 24;
  }

  return {
    width,
    isWide: isTablet,
    conteudoStyle: {
      width: contentWidth,
      maxWidth,
      alignSelf: 'center',
      paddingHorizontal,
    },
  };
}
