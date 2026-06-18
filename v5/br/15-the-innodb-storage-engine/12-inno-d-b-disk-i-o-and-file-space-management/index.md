## 14.12 I/O de Disco e Gerenciamento de Espaço de Arquivo do InnoDB

14.12.1 I/O de Disco do InnoDB

14.12.2 Gerenciamento de Espaço de Arquivo

14.12.3 Checkpoints do InnoDB

14.12.4 Desfragmentando uma Tabela

14.12.5 Recuperando Espaço em Disco com TRUNCATE TABLE

Como um DBA, você deve gerenciar o I/O de disco para evitar que o subsistema de I/O fique saturado, e gerenciar o espaço em disco para evitar que os dispositivos de armazenamento fiquem cheios. O modelo de design ACID requer uma certa quantidade de I/O que pode parecer redundante, mas ajuda a garantir a confiabilidade dos dados. Dentro dessas restrições, o `InnoDB` tenta otimizar o trabalho do Database e a organização dos arquivos de disco para minimizar a quantidade de I/O de disco. Às vezes, o I/O é adiado até que o Database não esteja ocupado, ou até que tudo precise ser levado a um estado consistente, como durante um restart do Database após um *shutdown* rápido.

Esta seção discute as principais considerações para I/O e espaço em disco com o tipo padrão de tabelas MySQL (também conhecidas como tabelas `InnoDB`):

* Controlar a quantidade de I/O de background usada para melhorar a performance de Querys.
* Habilitar ou desabilitar funcionalidades que fornecem durabilidade extra, às custas de I/O adicional.
* Organizar tabelas em vários arquivos pequenos, alguns arquivos maiores ou uma combinação de ambos.
* Balancear o tamanho dos arquivos de *redo log* contra a atividade de I/O que ocorre quando os arquivos de *log* ficam cheios.
* Como reorganizar uma tabela para uma performance de Query ideal.