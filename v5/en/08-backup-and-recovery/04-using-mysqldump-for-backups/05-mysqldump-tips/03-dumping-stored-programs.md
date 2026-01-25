#### 7.4.5.3 Dump de Stored Programs

Várias opções controlam como o **mysqldump** lida com Stored Programs (Stored Procedures e Functions, Triggers e Events):

* `--events`: Realiza o Dump dos Events do Event Scheduler

* `--routines`: Realiza o Dump de Stored Procedures e Functions

* `--triggers`: Realiza o Dump dos Triggers das tabelas

A opção `--triggers` é habilitada por padrão, de modo que, quando as tabelas são submetidas ao Dump, elas são acompanhadas por quaisquer Triggers que possuam. As outras opções estão desabilitadas por padrão e devem ser especificadas explicitamente para que o Dump dos objetos correspondentes seja realizado. Para desabilitar explicitamente qualquer uma dessas opções, use sua forma de "skip": `--skip-events`, `--skip-routines` ou `--skip-triggers`.