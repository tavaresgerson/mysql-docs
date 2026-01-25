#### 4.2.2.5 Usando Opções para Definir Variáveis de Programa

Muitos programas MySQL possuem variáveis internas que podem ser definidas em tempo de execução usando o `SET` statement. Consulte a Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variable”, e a Seção 5.1.8, “Usando System Variables”.

A maioria dessas variáveis de programa também pode ser definida na inicialização do server usando a mesma sintaxe aplicada à especificação de Options de programa. Por exemplo, o **mysql** possui uma variable `max_allowed_packet` que controla o tamanho máximo do seu communication buffer. Para definir a variable `max_allowed_packet` para o **mysql** com um valor de 16MB, use qualquer um dos seguintes comandos:

```sql
mysql --max_allowed_packet=16777216
mysql --max_allowed_packet=16M
```

O primeiro comando especifica o valor em bytes. O segundo especifica o valor em megabytes. Para variáveis que aceitam um valor numérico, o valor pode ser fornecido com um suffix `K`, `M` ou `G` (maiúsculo ou minúsculo) para indicar um multiplicador de 1024, 10242 ou 10243. (Por exemplo, quando usados para definir `max_allowed_packet`, os suffixes indicam unidades de kilobytes, megabytes ou gigabytes.)

Em um arquivo de Option, as configurações de variable são fornecidas sem os traços iniciais:

```sql
[mysql]
max_allowed_packet=16777216
```

Ou:

```sql
[mysql]
max_allowed_packet=16M
```

Se desejar, underscores (sublinhados) em um nome de Option podem ser especificados como traços. Os seguintes grupos de Option são equivalentes. Ambos definem o tamanho do key buffer do server para 512MB:

```sql
[mysqld]
key_buffer_size=512M

[mysqld]
key-buffer-size=512M
```

Em versões mais antigas do MySQL, Options de programa podiam ser especificadas por completo ou como qualquer prefixo não ambíguo. Por exemplo, a Option `--compress` poderia ser fornecida ao **mysqldump** como `--compr`, mas não como `--comp` porque esta última é ambígua. No MySQL 5.7, os prefixes de Option não são mais suportados; apenas Options completas são aceitas. Isso ocorre porque os prefixes podem causar problemas quando novas Options são implementadas para programas, e um prefixo que é atualmente não ambíguo pode se tornar ambíguo no futuro. Algumas implicações desta mudança:

* A Option `--key-buffer` agora deve ser especificada como `--key-buffer-size`.

* A Option `--skip-grant` agora deve ser especificada como `--skip-grant-tables`.

Suffixes para especificar um multiplicador de valor podem ser usados ao definir uma variable no momento da invocação do programa, mas não para definir o valor com `SET` em tempo de execução (runtime). Por outro lado, com `SET`, você pode atribuir o valor de uma variable usando uma expression, o que não é verdade quando você define uma variable na inicialização do server. Por exemplo, a primeira das seguintes linhas é legal no momento da invocação do programa, mas a segunda não é:

```sql
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Inversamente, a segunda das seguintes linhas é legal em tempo de execução (runtime), mas a primeira não é:

```sql
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```