## Visões de Dualidade JSON

27.7.1 Criando Visões de Dualidade JSON

27.7.2 Operações DML em Visões de Dualidade JSON (MySQL Enterprise Edition)

27.7.3 Metadados das Visões de Dualidade JSON

O MySQL 9.5 suporta visões de dualidade JSON. Também conhecidas como visões de dualidade relacionais JSON, esses objetos são consultas armazenadas que, quando invocadas, produzem um conjunto de valores no formato JSON. Na prática, uma visão de dualidade JSON atua como um documento JSON virtual ou como uma coleção de documentos JSON virtuais.

Com as visões de dualidade JSON, você pode estabelecer uma correspondência entre tabelas relacionais e um documento JSON multi-nível hierárquico, unificando efetivamente dados estruturados (relacionais) e semi-estruturados (JSON). Isso permite que você aproveite a força de ambos os modelos (sinergia perfeita dos modelos JSON com APIs REST e integridade referencial dos modelos relacionais) e oferece às suas aplicações a opção de leitura e escrita usando qualquer um dos modelos de dados.

A discussão nas próximas seções descreve a sintaxe para criar, alterar e descartar visões de dualidade JSON, mostra alguns exemplos de como usá-las e fornece informações sobre a obtenção de metadados relacionados.

As operações DML em visões de dualidade JSON são suportadas apenas na MySQL Enterprise Edition. Consulte a Seção 27.7.2, “Operações DML em Visões de Dualidade JSON (MySQL Enterprise Edition”)"), para mais informações.