### 6.2.2 Especificação das opções de programa

Existem várias maneiras de especificar opções para programas MySQL:

- Lista as opções na linha de comando após o nome do programa.
- Listar as opções em um arquivo de opções que o programa lê quando é iniciado. Isto é comum para as opções que você quer que o programa use cada vez que ele é executado.
- Esta técnica é útil para as opções que você deseja aplicar a cada vez que o programa é executado. Na prática, os arquivos de opções são mais comumente usados para este propósito, mas a Seção 7.8.3, "Executar múltiplas instâncias MySQL no Unix", discute uma situação em que as variáveis de ambiente podem ser muito úteis. Ela descreve uma técnica prática que usa essas variáveis para especificar o número de porta TCP / IP e o arquivo de soquete Unix para o servidor e para os programas cliente.

As opções são processadas em ordem, portanto, se uma opção for especificada várias vezes, a última ocorrência tem precedência. O seguinte comando faz com que `mysql` se conecte ao servidor em `localhost`:

```
mysql -h example.com -h localhost
```

Há uma exceção: Para `mysqld`, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja substituído na linha de comando.

Se forem dadas opções conflitantes ou relacionadas, as opções posteriores terão precedência sobre as opções anteriores. O seguinte comando é executado `mysql` no modo sem nomes de coluna:

```
mysql --column-names --skip-column-names
```

Os programas MySQL determinam quais opções são dadas primeiro examinando variáveis de ambiente, em seguida, processando arquivos de opção e, em seguida, verificando a linha de comando.

Para o servidor, uma exceção se aplica: O arquivo de opção **mysqld-auto.cnf** no diretório de dados é processado por último, então ele tem precedência até mesmo sobre as opções de linha de comando.

Você pode tirar proveito da maneira como os programas MySQL processam opções especificando valores de opção padrão para um programa em um arquivo de opções. Isso permite que você evite digitá-los cada vez que você executar o programa, permitindo que você substitua os padrões, se necessário, usando opções de linha de comando.
