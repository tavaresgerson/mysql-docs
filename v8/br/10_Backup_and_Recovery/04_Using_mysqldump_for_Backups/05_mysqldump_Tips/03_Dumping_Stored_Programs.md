#### 9.4.5.3 Lançamento de programas armazenados

Várias opções controlam como o **mysqldump** lida com programas armazenados (procedimentos e funções armazenados, gatilhos e eventos):

- `--events`: Gerenciador de eventos de descarte

- `--routines`: Expor procedimentos e funções armazenados

- `--triggers`: Descargas de gatilhos para tabelas

A opção `--triggers` está habilitada por padrão, para que, ao fazer o dumping de tabelas, elas sejam acompanhadas por quaisquer gatilhos que elas tenham. As outras opções estão desabilitadas por padrão e devem ser especificadas explicitamente para fazer o dumping dos objetos correspondentes. Para desabilitar explicitamente qualquer uma dessas opções, use sua forma de pular: `--skip-events`, `--skip-routines` ou `--skip-triggers`.
