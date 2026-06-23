import type { Locale } from '../i18n/utils';

export interface ProcessStep {
  name: string;
  desc: string;
}

const processSteps: Record<Locale, ProcessStep[]> = {
  pt: [
    {
      name: 'Definição estratégica',
      desc: 'Clarificamos o problema, o contexto e os objetivos antes de qualquer decisão formal.',
    },
    {
      name: 'Desenvolvimento formal',
      desc: 'Desenvolvemos conceito, forma e função com rigor, testando e refinando até ganhar consistência.',
    },
    {
      name: 'Seleção de materiais',
      desc: 'Escolhemos materiais com critério — qualidade, origem e impacto.',
    },
    {
      name: 'Sourcing',
      desc: 'Identificamos e validamos os parceiros certos para cada projeto.',
    },
    {
      name: 'Produção',
      desc: 'Acompanhamos a produção do início ao fim, assegurando prazos e a conformidade do resultado.',
    },
    {
      name: 'Comunicação de marca',
      desc: 'Asseguramos que o objeto chega ao mundo com a apresentação que merece.',
    },
  ],
  en: [
    {
      name: 'Strategic definition',
      desc: 'We clarify the problem, context and objectives before any formal decision.',
    },
    {
      name: 'Formal development',
      desc: 'Concept, form and function take shape through rigorous iteration.',
    },
    {
      name: 'Material selection',
      desc: 'We choose materials with care — quality, origin and impact.',
    },
    {
      name: 'Sourcing',
      desc: 'We identify and validate the right production partners for each project.',
    },
    {
      name: 'Production oversight',
      desc: 'We manage the production process from start to finish, without delegating responsibility.',
    },
    {
      name: 'Brand communication',
      desc: 'We ensure the object reaches the world with the presentation it deserves.',
    },
  ],
};

export function getProcessSteps(locale: Locale): ProcessStep[] {
  return processSteps[locale];
}
