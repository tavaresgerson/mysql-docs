#### 9.4.5.3 Execução de programas armazenados

Várias opções controlam como o `mysqldump` lida com programas armazenados (procedimentos e funções armazenados, gatilhos e eventos):

* `--events`: Executa eventos do Agendamento de Eventos
* `--routines`: Executa procedimentos e funções armazenados
* `--triggers`: Executa gatilhos para tabelas

A opção `--triggers` está habilitada por padrão, para que, quando tabelas são excluídas, elas sejam acompanhadas por quaisquer gatilhos que elas tenham. As outras opções estão desabilitadas por padrão e devem ser especificadas explicitamente para excluir os objetos correspondentes. Para desabilitar explicitamente qualquer uma dessas opções, use sua forma de omissão: `--skip-events`, `--skip-routines` ou `--skip-triggers`.