#### 6.6.4.6 Uso da memória

A alocação de memória é importante quando você executa `myisamchk`. `myisamchk` não usa mais memória do que suas variáveis relacionadas à memória estão definidas. Se você vai usar `myisamchk` em tabelas muito grandes, você deve primeiro decidir quanto de memória você quer que ele use. O padrão é usar apenas cerca de 3MB para realizar reparos. Usando valores maiores, você pode fazer com que `myisamchk` funcione mais rápido. Por exemplo, se você tiver mais de 512MB de RAM disponíveis, você pode usar opções como estas (além de quaisquer outras opções que você possa especificar):

```
myisamchk --myisam_sort_buffer_size=256M \
           --key_buffer_size=512M \
           --read_buffer_size=64M \
           --write_buffer_size=64M ...
```

Usando `--myisam_sort_buffer_size=16M` é provavelmente suficiente para a maioria dos casos.

Esteja ciente de que `myisamchk` usa arquivos temporários em `TMPDIR`. Se `TMPDIR` aponta para um sistema de arquivos de memória, erros de falta de memória podem facilmente ocorrer. Se isso acontecer, execute `myisamchk` com a opção `--tmpdir=dir_name` para especificar um diretório localizado em um sistema de arquivos que tem mais espaço.

Ao executar operações de reparo, `myisamchk` também precisa de muito espaço em disco:

- O duplo do tamanho do arquivo de dados (o arquivo original e uma cópia). Este espaço não é necessário se você fizer um reparo com `--quick`; neste caso, apenas o arquivo de índice é recriado. *Este espaço deve estar disponível no mesmo sistema de arquivos que o arquivo de dados original*, pois a cópia é criada no mesmo diretório que o original.
- Espaço para o novo arquivo de índice que substitui o antigo. O arquivo de índice antigo é truncado no início da operação de reparo, então você geralmente ignora este espaço. Este espaço deve estar disponível no mesmo sistema de arquivos que o arquivo de dados original.
- Ao usar `--recover` ou `--sort-recover` (mas não ao usar `--safe-recover`), você precisa de espaço no disco para classificação. Este espaço é alocado no diretório temporário (especificado por `TMPDIR` ou `--tmpdir=dir_name`). A seguinte fórmula produz a quantidade de espaço necessário:

  ```
  (largest_key + row_pointer_length) * number_of_rows * 2
  ```

  Você pode verificar o comprimento das chaves e o `row_pointer_length` com **myisamchk -dv `tbl_name`** (ver Seção 6.6.4.5, Obtenção de Informações da Tabela com myisamchk). Os valores `row_pointer_length` e `number_of_rows` são os valores `Datafile pointer` e `Data records` na descrição da tabela. Para determinar o valor `largest_key`, verifique as linhas `Key` na tabela. A descrição da coluna `Len` indica o número de bytes para cada parte-chave. Para um índice de várias colunas, o tamanho da chave é a soma dos valores do `Len` para todas as partes-chave.

Se você tiver um problema com o espaço em disco durante o reparo, você pode tentar `--safe-recover` em vez de `--recover`.
