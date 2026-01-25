### 4.2.2 Especificando Opções de Programa

4.2.2.1 Usando Options na Command Line

4.2.2.2 Usando Arquivos de Option

4.2.2.3 Options de Command Line que Afetam o Manuseio de Arquivos de Option

4.2.2.4 Modificadores de Option de Programa

4.2.2.5 Usando Options para Definir Variáveis de Programa

4.2.2.6 Defaults de Option, Options que Esperam Valores e o Sinal de =

Existem diversas maneiras de especificar options para programas MySQL:

* Liste as options na Command Line após o nome do programa. Isso é comum para options que se aplicam a uma invocação específica do programa.

* Liste as options em um arquivo de option que o programa lê ao ser iniciado. Isso é comum para options que você deseja que o programa utilize sempre que for executado.

* Liste as options em variáveis de ambiente (consulte a Seção 4.2.7, “Setting Environment Variables”). Este método é útil para options que você deseja aplicar sempre que o programa é executado. Na prática, arquivos de option são usados mais comumente para essa finalidade, mas a Seção 5.7.3, “Running Multiple MySQL Instances on Unix”, discute uma situação na qual variáveis de ambiente podem ser muito úteis. Ela descreve uma técnica prática que utiliza tais variáveis para especificar o número da porta TCP/IP e o Unix socket file para o Server e para programas Client.

Options são processadas em ordem, portanto, se uma option for especificada várias vezes, a última ocorrência terá precedência. O comando a seguir faz com que o **mysql** se conecte ao Server rodando em `localhost`:

```sql
mysql -h example.com -h localhost
```

Há uma exceção: Para o **mysqld**, a *primeira* instância da option `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de option seja sobrescrito na Command Line.

Se options conflitantes ou relacionadas forem fornecidas, as options posteriores terão precedência sobre as options anteriores. O comando a seguir executa o **mysql** no modo “no column names”:

```sql
mysql --column-names --skip-column-names
```

Os programas MySQL determinam quais options são fornecidas primeiro examinando variáveis de ambiente, depois processando arquivos de option e, em seguida, verificando a Command Line. Como options posteriores têm precedência sobre as anteriores, a ordem de processamento significa que as variáveis de ambiente têm a precedência mais baixa e as options de Command Line, a mais alta.

Você pode aproveitar a maneira como os programas MySQL processam options especificando valores de option default para um programa em um arquivo de option. Isso permite que você evite digitá-los toda vez que executar o programa, ao mesmo tempo que permite que você sobrescreva os defaults, se necessário, usando options de Command Line.