## 17.11 Gerenciamento de E/S de Disco e Espaço de Arquivo do InnoDB

17.11.1 E/S de Disco do InnoDB

17.11.2 Gerenciamento de Espaço de Arquivo

17.11.3 Pontuais de Controle do InnoDB

17.11.4 Desfragmentação de uma Tabela

17.11.5 Recuperação de Espaço de Disco com TRUNCATE TABLE

Como um DBA, você deve gerenciar o E/S de disco para evitar que o subsistema de E/S fique saturado e o espaço de disco para evitar que os dispositivos de armazenamento se encham. O modelo de design ACID requer uma certa quantidade de E/S que pode parecer redundante, mas ajuda a garantir a confiabilidade dos dados. Dentro dessas restrições, o `InnoDB` tenta otimizar o trabalho do banco de dados e a organização dos arquivos de disco para minimizar a quantidade de E/S de disco. Às vezes, o E/S é adiado até que o banco de dados não esteja ocupado ou até que tudo precise ser trazido a um estado consistente, como durante o reinício do banco de dados após um desligamento rápido.

Esta seção discute as principais considerações para o E/S e o espaço de disco com o tipo padrão de tabelas do MySQL (também conhecidas como tabelas `InnoDB`):

* Controlar a quantidade de E/S de fundo usada para melhorar o desempenho das consultas.

* Habilitar ou desabilitar recursos que fornecem durabilidade extra em detrimento de um E/S adicional.

* Organizar tabelas em muitos arquivos pequenos, alguns arquivos maiores ou uma combinação de ambos.

* Equilibrar o tamanho dos arquivos de log de revisão com a atividade de E/S que ocorre quando os arquivos de log ficam cheios.

* Como reorganizar uma tabela para um desempenho ótimo das consultas.