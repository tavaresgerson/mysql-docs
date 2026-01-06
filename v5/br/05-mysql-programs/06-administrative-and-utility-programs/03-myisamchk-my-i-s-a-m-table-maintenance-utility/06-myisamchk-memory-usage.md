#### 4.6.3.6 Uso de memória do myisamchk

A alocação de memória é importante quando você executa **myisamchk**. **myisamchk** não usa mais memória do que as variáveis relacionadas à memória estão configuradas. Se você vai usar **myisamchk** em tabelas muito grandes, você deve primeiro decidir quanto memória você deseja que ele use. O padrão é usar apenas cerca de 3 MB para realizar reparos. Ao usar valores maiores, você pode fazer com que **myisamchk** funcione mais rápido. Por exemplo, se você tiver mais de 512 MB de RAM disponível, você pode usar opções como essas (em adição a quaisquer outras opções que você possa especificar):

```sql
myisamchk --myisam_sort_buffer_size=256M \
           --key_buffer_size=512M \
           --read_buffer_size=64M \
           --write_buffer_size=64M ...
```

Usar `--myisam_sort_buffer_size=16M` provavelmente é suficiente na maioria dos casos.

Tenha em mente que o **myisamchk** usa arquivos temporários em `TMPDIR`. Se `TMPDIR` apontar para um sistema de arquivos de memória, erros de falta de memória podem ocorrer facilmente. Se isso acontecer, execute o **myisamchk** com a opção `--tmpdir=dir_name` para especificar um diretório localizado em um sistema de arquivos que tenha mais espaço.

Ao realizar operações de reparo, o **myisamchk** também precisa de muito espaço em disco:

- O dobro do tamanho do arquivo de dados (o arquivo original e uma cópia). Esse espaço não é necessário se você fizer uma reparação com `--quick`; nesse caso, apenas o arquivo de índice é recriado. *Esse espaço deve estar disponível no mesmo sistema de arquivos do arquivo de dados original*, pois a cópia é criada no mesmo diretório do original.

- Espaço para o novo arquivo de índice que substitui o antigo. O arquivo de índice antigo é truncado no início da operação de reparo, então você geralmente ignora esse espaço. Esse espaço deve estar disponível no mesmo sistema de arquivos que o arquivo de dados original.

- Ao usar `--recover` ou `--sort-recover` (mas não quando usar `--safe-recover`), você precisa de espaço no disco para a ordenação. Esse espaço é alocado no diretório temporário (especificado por `TMPDIR` ou `--tmpdir=dir_name`). A seguinte fórmula fornece a quantidade de espaço necessária:

  ```sql
  (largest_key + row_pointer_length) * number_of_rows * 2
  ```

  Você pode verificar o comprimento das chaves e o *`row_pointer_length`* com **myisamchk -dv *`tbl_name`*** (veja a Seção 4.6.3.5, “Obtendo Informações da Tabela com myisamchk”). Os valores de *`row_pointer_length`* e *`number_of_rows`* são os valores de `Datafile pointer` e `Data records` na descrição da tabela. Para determinar o valor de *`largest_key`*, verifique as linhas `Key` na descrição da tabela. A coluna `Len` indica o número de bytes para cada parte da chave. Para um índice de múltiplos colunas, o tamanho da chave é a soma dos valores `Len` para todas as partes da chave.

Se você tiver um problema com o espaço em disco durante a reparação, você pode tentar `--safe-recover` em vez de `--recover`.
