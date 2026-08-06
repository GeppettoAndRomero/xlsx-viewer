import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Visor de Excel — abre XLSX en el navegador, sin subirlo | runlocally',
    description:
      'Abre libros XLSX, XLSM y XLS en el navegador. Cambia de hoja y consulta las celdas en una tabla de solo lectura sin subir el archivo.',
    ogTitle: 'Visor de Excel — consulta libros en el navegador',
    ogDescription:
      'Consulta hojas XLSX, XLSM y XLS en una tabla local de solo lectura. El libro no se sube.',
  },

  hero: {
    h1: 'Visor de libros de Excel',
    tagline:
      'Abre archivos XLSX, XLSM o XLS en el navegador, cambia de hoja y consulta las celdas sin subir el libro.',
  },

  intro: {
    h2: 'Consulta un libro de Excel en el navegador',
    paras: [
      'El visor abre un libro de Excel cada vez y presenta cada hoja como una tabla de solo lectura. Las pestañas permiten cambiar de hoja, y los encabezados de filas y columnas sirven de referencia al desplazarte.',
      'Cuando una hoja es grande, la página solo representa las filas y columnas próximas a la zona visible. El análisis del libro sigue utilizando la memoria del dispositivo, así que el tamaño admisible depende del navegador y del equipo.',
    ],
  },

  privacy: {
    h2: 'Los datos del libro se procesan en el navegador',
    lead:
      'SheetJS Community Edition lee el archivo seleccionado dentro del navegador. No hay un paso de subida ni procesamiento del libro en un servidor:',
    points: [
      'El navegador lee los datos del archivo que eliges en tu dispositivo.',
      'Los valores de cada hoja se convierten en una tabla dentro de la página.',
      'Ninguna petición de red incluye el contenido del libro.',
      'El código fuente está disponible con licencia MIT.',
    ],
    note:
      'Puedes abrir el panel Red del navegador mientras cargas un libro para comprobar que ninguna petición transporta el archivo.',
    sourceLinkText: 'Leer el código fuente.',
  },

  howto: {
    h2: 'Cómo usar el visor',
    steps: [
      {
        h3: 'Selecciona un libro',
        p: 'Elige un archivo XLSX, XLSM o XLS, o suelta uno sobre la página.',
      },
      {
        h3: 'Cambia de hoja',
        p: 'Usa las pestañas situadas sobre la tabla para elegir la hoja que quieres consultar.',
      },
      {
        h3: 'Consulta las celdas',
        p: 'Desplázate en horizontal y en vertical por la tabla de solo lectura. Cierra la vista para abrir otro libro.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi libro a algún sitio?',
      a: 'No. El libro se analiza en el navegador y el visor no envía su contenido a un servidor. Puedes comprobarlo en el panel Red del navegador.',
    },
    {
      q: '¿Qué formatos de Excel puedo abrir?',
      a: 'El selector admite libros XLSX, XLSM y el formato XLS antiguo. Los archivos protegidos con contraseña, dañados o con estructuras no compatibles podrían no abrirse.',
    },
    {
      q: '¿Cómo se muestran las fórmulas?',
      a: 'El visor muestra el resultado de cálculo guardado en el libro. No vuelve a calcular las fórmulas, por lo que el resultado puede faltar o estar desactualizado si el archivo no contiene un valor almacenado reciente.',
    },
    {
      q: '¿Puedo editar o guardar el libro?',
      a: 'No. Es un visor de solo lectura: no edita celdas, no ejecuta macros ni escribe un archivo de Excel.',
    },
    {
      q: '¿Muestra las imágenes incrustadas en las hojas?',
      a: 'No. SheetJS Community Edition no procesa las imágenes incrustadas en los libros, por lo que el visor no puede mostrarlas.',
    },
    {
      q: '¿Qué ocurre con las hojas grandes?',
      a: 'La tabla representa una ventana de filas y columnas cercanas a la zona visible, en lugar de añadir todas las celdas a la página a la vez. El análisis sigue usando la memoria del dispositivo.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto; se utilizó asistencia de IA en partes del código y del texto.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};
