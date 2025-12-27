### 6.2.2 Especificando Opções do Programa

6.2.2.1 Usando Opções na Linha de Comando

6.2.2.2 Usando Arquivos de Opções

6.2.2.3 Opções da Linha de Comando que Afetam o Tratamento de Arquivos de Opções

6.2.2.4 Modificadores de Opções do Programa

6.2.2.5 Usando Opções para Definir Variáveis do Programa

6.2.2.6 Padrões de Opções, Opções que Esperam Valores e o Sinal =

Existem várias maneiras de especificar opções para programas MySQL:

* Liste as opções na linha de comando após o nome do programa. Isso é comum para opções que se aplicam a uma invocação específica do programa.

* Liste as opções em um arquivo de opções que o programa lê quando ele começa. Isso é comum para opções que você deseja que o programa use cada vez que ele for executado.

* Liste as opções em variáveis de ambiente (consulte a Seção 6.2.9, “Definindo Variáveis de Ambiente”). Esse método é útil para opções que você deseja aplicar cada vez que o programa for executado. Na prática, arquivos de opções são usados mais comumente para esse propósito, mas a Seção 7.8.3, “Executando Múltiplas Instâncias do MySQL no Unix”, discute uma situação em que as variáveis de ambiente podem ser muito úteis. Ela descreve uma técnica útil que usa tais variáveis para especificar o número de porta TCP/IP e o arquivo de soquete Unix para o servidor e para os programas cliente.

As opções são processadas em ordem, então, se uma opção for especificada várias vezes, a última ocorrência tem precedência. O seguinte comando faz com que o **mysql** se conecte ao servidor que está rodando em `localhost`:

```
mysql -h example.com -h localhost
```

Há uma exceção: Para o **mysqld**, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opções seja sobrescrito na linha de comando.

Se opções conflitantes ou relacionadas forem fornecidas, as opções posteriores têm precedência sobre as anteriores. O seguinte comando executa o **mysql** no modo “sem nomes de colunas”:

```
mysql --column-names --skip-column-names
```

Os programas do MySQL determinam quais opções são fornecidas primeiro examinando variáveis de ambiente, processando arquivos de opções e verificando a linha de comando. Como as opções posteriores têm precedência sobre as anteriores, a ordem de processamento significa que as variáveis de ambiente têm a menor precedência e as opções da linha de comando a maior.

Para o servidor, uma exceção se aplica: o arquivo de opção **mysqld-auto.cnf** no diretório de dados é processado por último, portanto, tem precedência mesmo sobre as opções da linha de comando.

Você pode aproveitar a maneira como os programas do MySQL processam opções, especificando valores padrão de opções para um programa em um arquivo de opção. Isso permite que você evite digitar-os cada vez que executa o programa, ao mesmo tempo em que permite que você substitua os padrões, se necessário, usando opções da linha de comando.