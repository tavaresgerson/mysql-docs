## 14.12 Gerenciamento de I/O de disco e espaço de arquivo do InnoDB

14.12.1 I/O de disco do InnoDB

14.12.1 Gerenciamento de Espaço em Arquivos

14.12.3 Pontos de verificação do InnoDB

14.12.4 Desfragmentação de uma Tabela

14.12.5 Recuperação do Espaço em Disco com TRUNCATE TABLE

Como um DBA, você deve gerenciar o I/O de disco para evitar que o subsistema de I/O fique saturado e gerenciar o espaço em disco para evitar o esgotamento dos dispositivos de armazenamento. O modelo de design ACID exige uma certa quantidade de I/O que pode parecer redundante, mas ajuda a garantir a confiabilidade dos dados. Dentro dessas restrições, o `InnoDB` tenta otimizar o trabalho do banco de dados e a organização dos arquivos de disco para minimizar a quantidade de I/O de disco. Às vezes, o I/O é adiado até que o banco de dados não esteja ocupado ou até que tudo precise ser levado a um estado consistente, como durante o reinício do banco de dados após um desligamento rápido.

Esta seção discute as principais considerações para I/O e espaço em disco com o tipo padrão de tabelas MySQL (também conhecidas como tabelas `InnoDB`):

- Controlar a quantidade de I/O de fundo usada para melhorar o desempenho da consulta.

- Ativar ou desativar recursos que oferecem durabilidade extra em detrimento de I/O adicionais.

- Organize as tabelas em muitos arquivos pequenos, alguns arquivos maiores ou uma combinação de ambos.

- Equilibrar o tamanho dos arquivos de registro de revisão com a atividade de E/S que ocorre quando os arquivos de registro ficam cheios.

- Como reorganizar uma tabela para um desempenho ótimo de consulta.
