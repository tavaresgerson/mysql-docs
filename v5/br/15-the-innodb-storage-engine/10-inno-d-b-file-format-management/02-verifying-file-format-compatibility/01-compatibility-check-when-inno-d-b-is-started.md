#### 14.10.2.1 Verificação de compatibilidade quando o InnoDB é iniciado

Para evitar possíveis falhas ou corrupções de dados quando o InnoDB abre um conjunto de arquivos ib, ele verifica se pode suportar completamente os formatos de arquivo usados no conjunto de arquivos ib. Se o sistema for reiniciado após uma falha ou uma "desativação rápida" (ou seja, `innodb_fast_shutdown` for maior que zero), podem haver estruturas de dados no disco (como entradas de redo ou undo ou páginas de escrita dupla) que estejam em um formato "muito novo" para o software atual. Durante o processo de recuperação, danos sérios podem ser causados aos seus arquivos de dados se essas estruturas de dados forem acessadas. A verificação de inicialização do formato de arquivo ocorre antes que qualquer processo de recuperação comece, prevenindo assim problemas de consistência com as novas tabelas ou problemas de inicialização no servidor MySQL.

A partir da versão InnoDB 1.0.1, o espaço de tabela do sistema registra um identificador ou marcação para o formato de arquivo "mais alto" usado por qualquer tabela em qualquer um dos espaços de tabela que fazem parte do conjunto ib-file. As verificações desse marcador de formato de arquivo são controladas pelo parâmetro de configuração `innodb_file_format_check`, que está ativado por padrão.

Se a tag de formato de arquivo nas tabelas do sistema for mais recente ou superior à versão mais alta suportada pelo software em execução atualmente e se `innodb_file_format_check` estiver ativado, o seguinte erro será emitido ao iniciar o servidor:

```sql
InnoDB: Error: the system tablespace is in a
file format that this version doesn't support
```

Você também pode definir `innodb_file_format` para um nome de formato de arquivo. Isso impede que o InnoDB seja iniciado se o software atual não suportar o formato de arquivo especificado. Ele também define o "limite máximo" para o valor que você especificar. A capacidade de definir `innodb_file_format_check` é útil (com futuras versões) se você "desgravar" manualmente todas as tabelas em um conjunto de arquivos ib. Você pode então confiar na verificação do formato de arquivo no início se, posteriormente, usar uma versão mais antiga do InnoDB para acessar o conjunto de arquivos ib.

Em algumas circunstâncias limitadas, você pode querer iniciar o servidor e usar um conjunto de arquivos ib em um novo formato de arquivo que não é suportado pelo software que você está usando. Se você definir o parâmetro de configuração `innodb_file_format_check` para `OFF`, o InnoDB abre o banco de dados, mas emite essa mensagem de aviso no log de erro:

```sql
InnoDB: Warning: the system tablespace is in a
file format that this version doesn't support
```

Nota

Este é um ambiente perigoso, pois permite que o processo de recuperação seja executado, possivelmente corrompendo seu banco de dados se o desligamento anterior foi uma saída inesperada ou um "desligamento rápido". Você só deve definir `innodb_file_format_check` para `OFF` se tiver certeza de que o desligamento anterior foi feito com `innodb_fast_shutdown=0`, para que, essencialmente, nenhum processo de recuperação ocorra.

O parâmetro `innodb_file_format_check` afeta apenas o que acontece quando um banco de dados é aberto, não posteriormente. Por outro lado, o parâmetro `innodb_file_format` (que habilita um formato específico) determina apenas se uma nova tabela pode ser criada no formato habilitado ou não e não tem efeito sobre se um banco de dados pode ser aberto ou

A tag de formato de arquivo é um "limite máximo", e, como tal, é aumentada após o servidor ser iniciado, se uma tabela em um formato "superior" for criada ou se uma tabela existente for acessada para leitura ou escrita (assumindo que seu formato é suportado). Se você acessar uma tabela existente em um formato superior ao formato suportado pelo software em execução, a tag do espaço de tabela do sistema não é atualizada, mas a verificação de compatibilidade em nível de tabela é aplicada (e um erro é emitido), conforme descrito na Seção 14.10.2.2, "Verificação de Compatibilidade Ao Abrir uma Tabela". Toda vez que o limite máximo é atualizado, o valor de `innodb_file_format_check` também é atualizado, então o comando `SELECT @@innodb_file_format_check;` exibe o nome do último formato de arquivo conhecido por ser usado pelas tabelas no conjunto de arquivos ib atualmente abertos e suportado pelo software em execução.
