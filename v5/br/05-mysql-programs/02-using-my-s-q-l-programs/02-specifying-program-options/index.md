### 4.2.2 Especificação das Opções do Programa

4.2.2.1 Usar opções na linha de comando

4.2.2.2 Uso de arquivos de opção

4.2.2.3 Opções de linha de comando que afetam o tratamento de arquivos com Option

4.2.2.4 Modificadores de Opção do Programa

4.2.2.5 Usar Opções para Definir Variáveis do Programa

4.2.2.6 Opções Padrão, Valores Esperados das Opções e o Sinal de Igual (=)

Existem várias maneiras de especificar opções para programas MySQL:

- Liste as opções na linha de comando após o nome do programa. Isso é comum para opções que se aplicam a uma invocação específica do programa.

- Liste as opções em um arquivo de opções que o programa lê quando ele começa. Isso é comum para opções que você deseja que o programa use sempre que ele for executado.

- Liste as opções em variáveis de ambiente (consulte a Seção 4.2.7, “Definindo Variáveis de Ambiente”). Esse método é útil para opções que você deseja aplicar toda vez que o programa for executado. Na prática, os arquivos de opções são usados mais comumente para esse propósito, mas a Seção 5.7.3, “Executando Instâncias Múltiplas do MySQL no Unix”, discute uma situação em que as variáveis de ambiente podem ser muito úteis. Ela descreve uma técnica útil que usa essas variáveis para especificar o número da porta TCP/IP e o arquivo de soquete Unix para o servidor e para os programas cliente.

As opções são processadas em ordem, então, se uma opção for especificada várias vezes, a última ocorrência terá precedência. O comando a seguir faz com que o **mysql** se conecte ao servidor que está rodando em `localhost`:

```sql
mysql -h example.com -h localhost
```

Há uma exceção: para o **mysqld**, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja substituído na linha de comando.

Se forem fornecidas opções conflitantes ou relacionadas, as opções posteriores têm precedência sobre as opções anteriores. O seguinte comando executa o **mysql** no modo "sem nomes de colunas":

```sql
mysql --column-names --skip-column-names
```

Os programas do MySQL determinam quais opções são dadas primeiro ao examinar variáveis de ambiente, processar arquivos de opções e verificar a linha de comando. Como as opções posteriores têm precedência sobre as anteriores, a ordem de processamento significa que as variáveis de ambiente têm a menor precedência e as opções da linha de comando a maior.

Você pode aproveitar a forma como os programas do MySQL processam as opções, especificando valores padrão de opções para um programa em um arquivo de opções. Isso permite que você evite digitar-os toda vez que você executar o programa, ao mesmo tempo em que permite que você substitua os valores padrão, se necessário, usando opções de linha de comando.
