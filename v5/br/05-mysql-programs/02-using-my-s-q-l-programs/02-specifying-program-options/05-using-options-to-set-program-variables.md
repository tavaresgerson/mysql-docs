#### 4.2.2.5 Usar Opções para Definir Variáveis do Programa

Muitos programas do MySQL têm variáveis internas que podem ser definidas em tempo de execução usando a instrução `SET`. Veja a Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”, e a Seção 5.1.8, “Usando Variáveis do Sistema”.

A maioria dessas variáveis de programa também pode ser configurada na inicialização do servidor usando a mesma sintaxe que se aplica à especificação de opções de programa. Por exemplo, o **mysql** tem uma variável `max_allowed_packet` que controla o tamanho máximo do buffer de comunicação. Para definir a variável `max_allowed_packet` para o **mysql** em um valor de 16 MB, use um dos seguintes comandos:

```sql
mysql --max_allowed_packet=16777216
mysql --max_allowed_packet=16M
```

O primeiro comando especifica o valor em bytes. O segundo especifica o valor em megabytes. Para variáveis que aceitam um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` (mayúscula ou minúscula) para indicar um multiplicador de 1024, 10242 ou

10243. (Por exemplo, quando usado para definir `max_allowed_packet`, os sufixos indicam unidades de kilobytes, megabytes ou gigabytes.)

Em um arquivo de opção, as configurações variáveis são fornecidas sem as barras iniciais:

```
[mysql]
max_allowed_packet=16777216
```

Ou:

```
[mysql]
max_allowed_packet=16M
```

Se desejar, os sublinhados em um nome de opção podem ser especificados como travessões. Os seguintes grupos de opções são equivalentes. Ambos definem o tamanho do buffer de chave do servidor para 512 MB:

```
[mysqld]
key_buffer_size=512M

[mysqld]
key-buffer-size=512M
```

Em versões mais antigas do MySQL, as opções do programa podiam ser especificadas na íntegra ou como qualquer prefixo inequívoco. Por exemplo, a opção `--compress` poderia ser dada ao **mysqldump** como `--compr`, mas não como `--comp` porque este último é ambíguo. No MySQL 5.7, os prefixos de opções não são mais suportados; apenas as opções completas são aceitas. Isso ocorre porque os prefixos podem causar problemas quando novas opções são implementadas para os programas e um prefixo que atualmente é inequívoco pode se tornar ambíguo no futuro. Algumas implicações dessa mudança:

- A opção `--key-buffer` agora deve ser especificada como `--key-buffer-size`.

- A opção `--skip-grant` agora deve ser especificada como `--skip-grant-tables`.

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no momento da invocação do programa, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável no início do servidor. Por exemplo, a primeira das linhas a seguir é válida no momento da invocação do programa, mas a segunda não é:

```sh
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das linhas a seguir é legal durante a execução, mas a primeira não:

```sql
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```
