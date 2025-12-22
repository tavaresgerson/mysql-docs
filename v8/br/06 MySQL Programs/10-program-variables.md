#### 6.2.2.5 Utilização de opções para definir variáveis de programa

Muitos programas MySQL têm variáveis internas que podem ser definidas no tempo de execução usando a instrução `SET`. Veja Seção 15.7.6.1, SET Syntax for Variable Assignment, e Seção 7.1.9, Using System Variables.

A maioria dessas variáveis de programa também pode ser definida na inicialização do servidor usando a mesma sintaxe que se aplica à especificação de opções de programa. Por exemplo, `mysql` tem uma variável `max_allowed_packet` que controla o tamanho máximo de seu buffer de comunicação. Para definir a variável `max_allowed_packet` para `mysql` para um valor de 16MB, use um dos seguintes comandos:

```
mysql --max_allowed_packet=16777216
mysql --max_allowed_packet=16M
```

O primeiro comando especifica o valor em bytes. O segundo especifica o valor em megabytes. Para variáveis que tomam um valor numérico, o valor pode ser dado com um sufixo de `K`, `M`, ou `G` para indicar um multiplicador de 1024, 10242 ou 10243. (Por exemplo, quando usado para definir `max_allowed_packet`, os sufixos indicam unidades de kilobytes, megabytes ou gigabytes.) A partir de MySQL 8.0.14, um sufixo também pode ser `T`, `P`, e `E` para indicar um multiplicador de 10244, 10245 ou 10246.

Num ficheiro de opções, as definições das variáveis são indicadas sem os traços iniciais:

```
[mysql]
max_allowed_packet=16777216
```

Ou:

```
[mysql]
max_allowed_packet=16M
```

Se você quiser, os sublinhados em um nome de opção podem ser especificados como traços. Os seguintes grupos de opções são equivalentes. Ambos definem o tamanho do buffer de chaves do servidor em 512MB:

```
[mysqld]
key_buffer_size=512M

[mysqld]
key-buffer-size=512M
```

Os sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no tempo de invocação do programa, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável no início do servidor. Por exemplo, a primeira das seguintes linhas é legal no tempo de invocação do programa, mas a segunda não é:

```
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das seguintes linhas é legal em tempo de execução, mas a primeira não é:

```
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```
