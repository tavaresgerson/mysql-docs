#### 18.2.4.2 Problemas com tabelas que não são fechadas corretamente

Cada arquivo de índice `MyISAM` (arquivo `.MYI`) tem um contador no cabeçalho que pode ser usado para verificar se uma tabela foi fechada corretamente. Se você receber o seguinte aviso de `CHECK TABLE` ou **myisamchk**, isso significa que esse contador saiu de sincronia:

```
clients are using or haven't closed the table properly
```

Esse aviso não significa necessariamente que a tabela está corrompida, mas você deve, pelo menos, verificar a tabela.

O contador funciona da seguinte forma:

* A primeira vez que uma tabela é atualizada no MySQL, um contador no cabeçalho dos arquivos de índice é incrementado.

* O contador não é alterado durante atualizações posteriores.
* Quando a última instância de uma tabela é fechada (porque uma operação `FLUSH TABLES` foi realizada ou porque não há espaço no cache da tabela), o contador é decrementado se a tabela tiver sido atualizada em algum momento.

* Quando você conserta a tabela ou verifica a tabela e descobre que está tudo bem, o contador é zerado.

* Para evitar problemas com a interação com outros processos que possam verificar a tabela, o contador não é decrementado na fechadura se ele estiver zero.

Em outras palavras, o contador só pode se tornar incorreto nessas condições:

* Uma tabela `MyISAM` é copiada sem emitir primeiro `LOCK TABLES` e `FLUSH TABLES`.

* O MySQL caiu entre uma atualização e a fechadura final. (A tabela ainda pode estar tudo bem porque o MySQL sempre emite escritas para tudo entre cada instrução.)

* Uma tabela foi modificada por **myisamchk --recover** ou **myisamchk --update-state** ao mesmo tempo em que estava sendo usada pelo **mysqld**.

* Vários servidores **mysqld** estão usando a tabela e um servidor realizou uma `REPAIR TABLE` ou `CHECK TABLE` na tabela enquanto ela estava sendo usada por outro servidor. Nesse cenário, é seguro usar `CHECK TABLE`, embora você possa receber o aviso de outros servidores. No entanto, `REPAIR TABLE` deve ser evitado, pois, quando um servidor substitui o arquivo de dados por um novo, isso não é conhecido pelos outros servidores.

Em geral, é uma má ideia compartilhar um diretório de dados entre vários servidores. Consulte a Seção 7.8, “Executando múltiplas instâncias do MySQL em uma única máquina”, para uma discussão adicional.