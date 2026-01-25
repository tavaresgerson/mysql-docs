### 8.2.4 Otimizando Instruções de Alteração de Dados

8.2.4.1 Otimizando Instruções INSERT

8.2.4.2 Otimizando Instruções UPDATE

8.2.4.3 Otimizando Instruções DELETE

Esta seção explica como acelerar as instruções de alteração de dados: `INSERT`, `UPDATE` e `DELETE`. Aplicações OLTP tradicionais e aplicações web modernas tipicamente realizam muitas pequenas operações de alteração de dados, onde a *concurrency* é vital. Aplicações de análise de dados e de relatórios tipicamente executam operações de alteração de dados que afetam muitas linhas de uma vez, onde a principal consideração é o I/O para escrever grandes quantidades de dados e manter os Indexes atualizados. Para a inserção e atualização de grandes volumes de dados (conhecido na indústria como ETL, sigla para “extract-transform-load”), por vezes são utilizadas outras instruções SQL ou comandos externos que imitam os efeitos das instruções `INSERT`, `UPDATE` e `DELETE`.