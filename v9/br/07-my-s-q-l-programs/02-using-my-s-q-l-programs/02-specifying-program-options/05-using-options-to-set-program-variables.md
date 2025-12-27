#### 6.2.2.5 Usando Opções para Definir Variáveis de Programa

Muitos programas MySQL têm variáveis internas que podem ser definidas em tempo de execução usando a instrução `SET`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”, e a Seção 7.1.9, “Usando Variáveis de Sistema”.

A maioria dessas variáveis de programa também pode ser definida no início do servidor usando a mesma sintaxe que se aplica à especificação de opções de programa. Por exemplo, o **mysql** tem uma variável `max_allowed_packet` que controla o tamanho máximo do buffer de comunicação. Para definir a variável `max_allowed_packet` para o **mysql** em um valor de 16MB, use um dos seguintes comandos:

```
mysql --max_allowed_packet=16777216
mysql --max_allowed_packet=16M
```

O primeiro comando especifica o valor em bytes. O segundo especifica o valor em megabytes. Para variáveis que aceitam um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` para indicar um multiplicador de 1024, 10242 ou

10243. (Por exemplo, quando usado para definir `max_allowed_packet`, os sufixos indicam unidades de kilobytes, megabytes ou gigabytes.) A partir do MySQL 8.0.14, um sufixo também pode ser `T`, `P` e `E` para indicar um multiplicador de 10244, 10245 ou

10246. As letras dos sufixos podem ser maiúsculas ou minúsculas.

Em um arquivo de opção, as configurações de variáveis são fornecidas sem as barras iniciais:

```
[mysql]
max_allowed_packet=16777216
```

Ou:

```
[mysql]
max_allowed_packet=16M
```

Se desejar, sublinhados em um nome de opção podem ser especificados como barras. Os seguintes grupos de opções são equivalentes. Ambos definem o tamanho do buffer de chave do servidor para 512MB:
```
[mysqld]
key_buffer_size=512M

[mysqld]
key-buffer-size=512M
```

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no momento da invocação do programa, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável no início do servidor. Por exemplo, a primeira das linhas a seguir é legal no momento da invocação do programa, mas a segunda não é:

```
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das linhas a seguir é legal no tempo de execução, mas a primeira não é:

```
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```