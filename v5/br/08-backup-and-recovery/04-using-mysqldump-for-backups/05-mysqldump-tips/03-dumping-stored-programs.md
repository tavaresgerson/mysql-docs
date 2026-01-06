#### 7.4.5.3 Lançamento de programas armazenados

Várias opções controlam como o **mysqldump** lida com programas armazenados (procedimentos e funções armazenados, gatilhos e eventos):

- `--events`: Exiba os eventos do Agendamento de Eventos

- `--routines`: Exiba procedimentos e funções armazenados

- `--triggers`: Exiba gatilhos para tabelas

A opção `--triggers` está habilitada por padrão, para que, quando as tabelas são descarregadas, elas sejam acompanhadas por quaisquer gatilhos que elas tenham. As outras opções estão desabilitadas por padrão e devem ser especificadas explicitamente para descarregar os objetos correspondentes. Para desabilitar explicitamente qualquer uma dessas opções, use sua forma de pular: `--skip-events`, `--skip-routines` ou `--skip-triggers`.
