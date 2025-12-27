### 19.5.5 Como relatar bugs ou problemas de replicação

Quando você tiver determinado que não há erro do usuário envolvido e a replicação ainda não funciona ou é instável, é hora de nos enviar um relatório de bug. Precisamos obter o máximo de informações possível de você para poder localizar o bug. Por favor, reserve um tempo e esforço para preparar um bom relatório de bug.

Se você tiver um caso de teste reprodutível que demonstre o bug, insira-o em nosso banco de bugs usando as instruções da Seção 1.6, “Como relatar bugs ou problemas”. Se você tiver um problema “fantasma” (um que você não consegue duplicar a vontade), use o seguinte procedimento:

1. Verifique se não há erro do usuário envolvido. Por exemplo, se você atualizar a replica fora dos threads de replicação, os dados saem de sincronia, e você pode ter violações de chave única em atualizações. Neste caso, o thread de replicação para e espera que você limpe as tabelas manualmente para trazê-las de volta à sincronia. *Isso não é um problema de replicação. É um problema de interferência externa causando o falhanço da replicação.*

2. Certifique-se de que a replica está rodando com o registro binário habilitado (a variável de sistema `log_bin`) e com a opção `--log-replica-updates` habilitada, o que faz com que a replica registre as atualizações que recebe da fonte em seus próprios logs binários. Esses ajustes são os padrões.

3. Salve todas as evidências antes de reiniciar o estado de replicação. Se não tivermos informações ou apenas informações sutis, torna-se difícil ou impossível para nós localizar o problema. As evidências que você deve coletar são:

   * Todos os arquivos de log binário da fonte
   * Todos os arquivos de log binário da replica
   * A saída de `SHOW BINARY LOG STATUS` da fonte no momento em que você descobriu o problema

* A saída do comando `SHOW REPLICA STATUS` da replica no momento em que você descobriu o problema;

* Registros de erro da fonte e da replica;

4. Use o **mysqlbinlog** para examinar os logs binários. O seguinte deve ser útil para encontrar a declaração do problema. *`log_file`* e *`log_pos`* são os valores de `Master_Log_File` e `Read_Master_Log_Pos` do comando `SHOW REPLICA STATUS`.

```
   $> mysqlbinlog --start-position=log_pos log_file | head
   ```

Depois de coletar as evidências para o problema, tente isolá-lo como um caso de teste separado primeiro. Em seguida, insira o problema com o máximo de informações possível em nossa base de dados de bugs usando as instruções na Seção 1.6, “Como relatar bugs ou problemas”.