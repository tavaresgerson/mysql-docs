### 15.2.1 Opções de inicialização do MyISAM

As seguintes opções para **mysqld** podem ser usadas para alterar o comportamento das tabelas `MyISAM`. Para obter informações adicionais, consulte a Seção 5.1.6, “Opções de comando do servidor”.

**Tabela 15.3 Opção MyISAM e Referência de Variável**

<table frame="box" rules="all" summary="Referência para as opções de linha de comando do MyISAM e variáveis do sistema."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Nome</th> <th scope="col">Linha de comando</th> <th scope="col">Arquivo de Opções</th> <th scope="col">Sistema Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dinâmico</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_bulk_insert_buffer_size">tamanho_buffer_de_inserção_em_massa</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_concurrent_insert">concurrent_insert</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_delay_key_write">delay_key_write</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_have_rtree_keys">have_rtree_keys</a></th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_key_buffer_size">tamanho_buffer_chave</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-options.html#option_mysqld_log-isam">log-isam</a></th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="server-options.html#option_mysqld_myisam-block-size">tamanho_bloco_myisam</a></th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_data_pointer_size">myisam_data_pointer_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_max_sort_file_size">myisam_max_sort_file_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_mmap_size">myisam_mmap_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_recover_options">opções de recuperação do myisam</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_repair_threads">myisam_repair_threads</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_sort_buffer_size">tamanho_buffer_de_sorteio_myisam</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_stats_method">myisam_stats_method</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_myisam_use_mmap">myisam_use_mmap</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="server-system-variables.html#sysvar_tmp_table_size">tmp_table_size</a></th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Sim</td> </tr></tbody></table>

As seguintes variáveis de sistema afetam o comportamento das tabelas `MyISAM`. Para obter informações adicionais, consulte a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

- `tamanho_buffer_de_inserção_em_massa`

  O tamanho do cache de árvores usado na otimização de inserção em massa.

  Nota

  Este é um limite *por fio*!

- `delay_key_write=ALL`

  Não descarte tampões de chave entre os registros para qualquer tabela `MyISAM`.

  Nota

  Se você fizer isso, não deve acessar tabelas `MyISAM` de outro programa (como de outro servidor MySQL ou com **myisamchk**) quando as tabelas estiverem em uso. Isso pode comprometer o índice. O uso de `--external-locking` não elimina esse risco.

- `myisam_max_sort_file_size`

  O tamanho máximo do arquivo temporário que o MySQL é permitido usar enquanto recria um índice `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE` ou `LOAD DATA`). Se o tamanho do arquivo for maior que esse valor, o índice é criado usando o cache de chaves em vez disso, o que é mais lento. O valor é dado em bytes.

- `myisam_recover_options=mode`

  Defina o modo para recuperação automática de tabelas `MyISAM` que entraram em colapso.

- `myisam_sort_buffer_size`

  Defina o tamanho do buffer usado ao recuperar tabelas.

A recuperação automática é ativada se você iniciar o **mysqld** com a variável de sistema `myisam_recover_options` definida. Nesse caso, quando o servidor abre uma tabela `MyISAM`, ele verifica se a tabela está marcada como falha ou se a variável de contagem de abertura da tabela não for 0 e você estiver executando o servidor com o bloqueio externo desativado. Se uma dessas condições for verdadeira, o seguinte acontece:

- O servidor verifica a tabela em busca de erros.

- Se o servidor encontrar um erro, ele tentará realizar uma rápida reparação da tabela (com ordenação e sem recriação do arquivo de dados).

- Se a reparação falhar devido a um erro no arquivo de dados (por exemplo, um erro de chave duplicada), o servidor tenta novamente, desta vez recriando o arquivo de dados.

- Se a reparação ainda falhar, o servidor tenta novamente com o método da opção de reparação antiga (escrever linha por linha sem ordenar). Esse método deve ser capaz de reparar qualquer tipo de erro e tem requisitos de espaço em disco baixos.

Se a recuperação não conseguir recuperar todas as linhas de declarações concluídas anteriormente e você não especificar `FORCE` no valor da variável de sistema `myisam_recover_options`, a reparação automática será interrompida com uma mensagem de erro no log de erros:

```sql
Error: Couldn't repair table: test.g00pages
```

Se você especificar `FORCE`, uma mensagem de aviso como esta será escrita:

```sql
Warning: Found 344 of 354 rows when repairing ./test/g00pages
```

Se o valor de recuperação automática incluir `BACKUP`, o processo de recuperação criará arquivos com nomes do tipo `tbl_name-datetime.BAK`. Você deve ter um script **cron** que mova automaticamente esses arquivos dos diretórios do banco de dados para os meios de backup.
