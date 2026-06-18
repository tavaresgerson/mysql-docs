### 19.5.5 Como relatar erros ou problemas de replicação

Quando você tiver determinado que não há erro do usuário envolvido e a replicação ainda não funciona ou é instável, é hora de nos enviar um relatório de erro. Precisamos obter o máximo de informações possível de você para poder localizar o erro. Por favor, reserve um tempo e esforço para preparar um bom relatório de erro.

Se você tiver um caso de teste repetiível que demonstre o erro, insira-o em nosso banco de dados de bugs usando as instruções fornecidas na Seção 1.5, “Como Relatar Erros ou Problemas”. Se você tiver um problema “fantasma” (um que você não consegue duplicar à vontade), use o seguinte procedimento:

1. Verifique se não há erro do usuário envolvido. Por exemplo, se você atualizar a replica fora dos threads de replicação, os dados saem de sincronia e você pode ter violações de chave única nas atualizações. Nesse caso, o thread de replicação para e espera que você limpe as tabelas manualmente para colocá-las em sincronia. *Isso não é um problema de replicação. É um problema de interferência externa que faz com que a replicação falhe.*

2. Certifique-se de que a replica está em execução com o registro binário habilitado (a variável de sistema `log_bin`), e com a opção `--log-slave-updates` habilitada, o que faz com que a replica registre as atualizações que recebe da fonte em seus próprios logs binários. Esses ajustes são os padrões.

3. Salve todas as evidências antes de reiniciar o estado de replicação. Se não tivermos informações ou apenas informações vagas, fica difícil ou impossível para nós localizar o problema. As evidências que você deve coletar são:

   - Todos os arquivos de log binários da fonte

   - Todos os arquivos de log binários da replica

   - A saída de `SHOW MASTER STATUS` da fonte no momento em que você descobriu o problema

   - A saída do `SHOW REPLICA STATUS` da replica no momento em que você descobriu o problema

   - Registros de erro da fonte e da replica

4. Use **mysqlbinlog** para examinar os logs binários. O seguinte deve ser útil para encontrar a declaração do problema. `log_file` e `log_pos` são os valores `Master_Log_File` e `Read_Master_Log_Pos` de `SHOW REPLICA STATUS`.

   ```
   $> mysqlbinlog --start-position=log_pos log_file | head
   ```

Depois de coletar as evidências para o problema, tente isolá-lo como um caso de teste separado primeiro. Em seguida, insira o problema com o máximo de informações possível em nossa base de dados de erros, usando as instruções na Seção 1.5, “Como Relatar Erros ou Problemas”.
