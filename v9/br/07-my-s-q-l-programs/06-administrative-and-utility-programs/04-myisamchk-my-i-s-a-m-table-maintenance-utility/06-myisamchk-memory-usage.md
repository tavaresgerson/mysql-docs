#### 6.6.4.6 Uso de Memória do **myisamchk**

A alocação de memória é importante ao executar o **myisamchk**. O **myisamchk** não utiliza mais memória do que as variáveis relacionadas à memória estiverem configuradas. Se você planeja usar o **myisamchk** em tabelas muito grandes, você deve primeiro decidir quanto memória deseja que ele utilize. O padrão é usar apenas cerca de 3 MB para realizar reparos. Ao usar valores maiores, você pode fazer o **myisamchk** funcionar mais rápido. Por exemplo, se você tiver mais de 512 MB de RAM disponíveis, você pode usar opções como estas (em adição a quaisquer outras opções que você possa especificar):

```
myisamchk --myisam_sort_buffer_size=256M \
           --key_buffer_size=512M \
           --read_buffer_size=64M \
           --write_buffer_size=64M ...
```

Usar `--myisam_sort_buffer_size=16M` provavelmente é suficiente para a maioria dos casos.

Tenha em mente que o **myisamchk** utiliza arquivos temporários em `TMPDIR`. Se `TMPDIR` apontar para um sistema de arquivos de memória, erros de falta de memória podem ocorrer facilmente. Se isso acontecer, execute o **myisamchk** com a opção `--tmpdir=dir_name` para especificar um diretório localizado em um sistema de arquivos que tenha mais espaço.

Ao realizar operações de reparo, o **myisamchk** também precisa de muito espaço em disco:

* O dobro do tamanho do arquivo de dados (o arquivo original e uma cópia). Esse espaço não é necessário se você realizar uma reparação com `--quick`; nesse caso, apenas o arquivo de índice é recriado. *Esse espaço deve estar disponível no mesmo sistema de arquivos que o arquivo de dados original*, pois a cópia é criada no mesmo diretório que o original.

* Espaço para o novo arquivo de índice que substitui o antigo. O arquivo de índice antigo é truncado no início da operação de reparo, então você geralmente ignora esse espaço. Esse espaço deve estar disponível no mesmo sistema de arquivos que o arquivo de dados original.

* Ao usar `--recover` ou `--sort-recover` (mas não quando usar `--safe-recover`), você precisa de espaço no disco para a ordenação. Esse espaço é alocado no diretório temporário (especificado por `TMPDIR` ou `--tmpdir=dir_name`). A seguinte fórmula fornece a quantidade de espaço necessária:

  ```
  (largest_key + row_pointer_length) * number_of_rows * 2
  ```

  Você pode verificar o comprimento das chaves e o *`row_pointer_length`* com **myisamchk -dv *`tbl_name`*** (veja a Seção 6.6.4.5, “Obtendo Informações da Tabela com myisamchk”). Os valores de *`row_pointer_length`* e *`number_of_rows`* são os valores de `Datafile pointer` e `Data records` na descrição da tabela. Para determinar o valor de *`largest_key`*, verifique as linhas `Key` na descrição da tabela. A coluna `Len` indica o número de bytes para cada parte da chave. Para um índice de múltiplas colunas, o tamanho da chave é a soma dos valores de `Len` para todas as partes da chave.

Se você tiver um problema com o espaço no disco durante a reparação, você pode tentar `--safe-recover` em vez de `--recover`.