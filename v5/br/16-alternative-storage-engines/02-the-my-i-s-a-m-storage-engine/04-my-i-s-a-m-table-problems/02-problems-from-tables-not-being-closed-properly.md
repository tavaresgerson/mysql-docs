#### 15.2.4.2 Problemas decorrentes da não fechamento adequado das tabelas

Cada arquivo de índice `MyISAM` (arquivo `.MYI`) possui um contador no cabeçalho que pode ser usado para verificar se uma tabela foi fechada corretamente. Se você receber o seguinte aviso do `CHECK TABLE` ou **myisamchk**, isso significa que esse contador saiu de sincronia:

```sql
clients are using or haven't closed the table properly
```

Este aviso não significa necessariamente que a tabela está corrompida, mas você deve, pelo menos, verificar a tabela.

O contador funciona da seguinte forma:

- A primeira vez que uma tabela é atualizada no MySQL, um contador no cabeçalho dos arquivos de índice é incrementado.

- O contador não é alterado durante atualizações adicionais.

- Quando a última instância de uma tabela é fechada (porque uma operação `FLUSH TABLES` foi realizada ou porque não há espaço no cache da tabela), o contador é decrementado se a tabela tiver sido atualizada em algum momento.

- Quando você conserta a mesa ou verifica a mesa e ela está em boas condições, o contador é zerado.

- Para evitar problemas com a interação com outros processos que possam verificar a tabela, o contador não é decrementado ao fechar se ele estiver zero.

Em outras palavras, o contador pode se tornar incorreto apenas nessas condições:

- Uma tabela `MyISAM` é copiada sem emitir primeiro `LOCK TABLES` e `FLUSH TABLES`.

- O MySQL travou entre uma atualização e o fechamento final. (A tabela ainda pode estar em ordem, pois o MySQL sempre emite gravações para tudo o que está entre cada instrução.)

- Uma tabela foi modificada por **myisamchk --recover** ou **myisamchk --update-state** ao mesmo tempo em que estava sendo usada pelo **mysqld**.

- Vários servidores **mysqld** estão usando a tabela e um servidor realizou uma `REPAIR TABLE` ou `CHECK TABLE` na tabela enquanto ela estava sendo usada por outro servidor. Nesse cenário, é seguro usar `CHECK TABLE`, embora você possa receber o aviso de outros servidores. No entanto, a `REPAIR TABLE` deve ser evitada, pois, quando um servidor substitui o arquivo de dados por um novo, isso não é conhecido pelos outros servidores.

  Em geral, é uma má ideia compartilhar um diretório de dados entre vários servidores. Consulte a Seção 5.7, “Executando múltiplas instâncias do MySQL em uma única máquina”, para uma discussão adicional.
