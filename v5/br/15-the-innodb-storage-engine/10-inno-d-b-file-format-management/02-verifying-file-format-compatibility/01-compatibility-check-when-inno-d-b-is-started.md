#### 14.10.2.1 Verificação de Compatibilidade Quando o InnoDB É Inicializado

Para prevenir possíveis *crashes* ou corrupções de dados quando o InnoDB abre um *ib-file set*, ele verifica se pode suportar totalmente os *file formats* em uso dentro desse *ib-file set*. Se o sistema for reiniciado após um *crash*, ou um “*fast shutdown*” (ou seja, `innodb_fast_shutdown` é maior que zero), pode haver estruturas de dados em disco (como entradas de *redo* ou *undo*, ou páginas de *doublewrite*) que estão em um *format* “muito novo” para o *software* atual. Durante o processo de recuperação (*recovery*), sérios danos podem ser causados aos seus arquivos de dados se essas estruturas de dados forem acessadas. A verificação do *file format* na inicialização ocorre antes que qualquer processo de *recovery* comece, prevenindo assim problemas de consistência com as novas tabelas ou problemas de inicialização para o servidor MySQL.

A partir da versão InnoDB 1.0.1, o *system tablespace* registra um identificador ou *tag* para o *file format* “mais alto” usado por qualquer tabela em qualquer um dos *tablespaces* que fazem parte do *ib-file set*. As verificações contra esta *tag* de *file format* são controladas pelo parâmetro de configuração `innodb_file_format_check`, que é `ON` por padrão.

Se a *tag* de *file format* no *system tablespace* for mais nova ou mais alta do que a versão máxima suportada pelo *software* atualmente em execução e se `innodb_file_format_check` estiver `ON`, o seguinte *error* é emitido quando o servidor é iniciado:

```sql
InnoDB: Error: the system tablespace is in a
file format that this version doesn't support
```

Você também pode definir `innodb_file_format` para um nome de *file format*. Fazer isso impede que o InnoDB inicie se o *software* atual não suportar o *file format* especificado. Isso também define o “*high water mark*” para o valor que você especificar. A capacidade de definir `innodb_file_format_check` é útil (em futuras *releases*) se você fizer o “*downgrade*” manual de todas as tabelas em um *ib-file set*. Você pode então confiar na verificação do *file format* na inicialização se, subsequentemente, usar uma versão mais antiga do InnoDB para acessar o *ib-file set*.

Em algumas circunstâncias limitadas, você pode querer iniciar o servidor e usar um *ib-file set* que está em um novo *file format* não suportado pelo *software* que você está usando. Se você definir o parâmetro de configuração `innodb_file_format_check` como `OFF`, o InnoDB abre o *Database*, mas emite esta mensagem de *warning* no *error log*:

```sql
InnoDB: Warning: the system tablespace is in a
file format that this version doesn't support
```

Nota

Esta é uma configuração perigosa, pois permite que o processo de *recovery* seja executado, possivelmente corrompendo seu *Database* se o *shutdown* anterior foi uma saída inesperada ou um “*fast shutdown*”. Você só deve definir `innodb_file_format_check` como `OFF` se tiver certeza de que o *shutdown* anterior foi feito com `innodb_fast_shutdown=0`, de modo que essencialmente nenhum processo de *recovery* ocorra.

O parâmetro `innodb_file_format_check` afeta apenas o que acontece quando um *Database* é aberto, e não subsequentemente. Por outro lado, o parâmetro `innodb_file_format` (que habilita um *format* específico) apenas determina se uma nova tabela pode ou não ser criada no *format* habilitado e não tem efeito sobre se um *Database* pode ou não ser aberto.

A *tag* de *file format* é um “*high water mark*” e, como tal, é aumentada após a inicialização do servidor, caso uma tabela em um *format* “mais alto” seja criada ou uma tabela existente seja acessada para leitura ou escrita (presumindo que seu *format* seja suportado). Se você acessar uma tabela existente em um *format* mais alto do que o *format* suportado pelo *software* em execução, a *tag* do *system tablespace* não é atualizada, mas a verificação de compatibilidade em nível de tabela é aplicada (e um *error* é emitido), conforme descrito na Seção 14.10.2.2, “Verificação de Compatibilidade Quando uma Tabela É Aberta”. Sempre que o *high water mark* é atualizado, o valor de `innodb_file_format_check` também é atualizado, de modo que o comando `SELECT @@innodb_file_format_check;` exibe o nome do último *file format* conhecido por ser usado por tabelas no *ib-file set* atualmente aberto e suportado pelo *software* em execução.