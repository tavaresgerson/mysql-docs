#### B.3.2.4 Falha no Password Quando Inserido Interativamente

Programas Client do MySQL solicitam um Password quando invocados com uma opção `[[--password]](connection-options.html#option_general_password)` ou `-p` que não possui um valor de Password subsequente:

```sql
$> mysql -u user_name -p
Enter password:
```

Em alguns Systems, você pode descobrir que seu Password funciona quando especificado em um Option File ou na Command Line, mas não quando você o insere interativamente no `Enter password:` prompt. Isso ocorre quando a Library fornecida pelo System para ler Passwords limita os Password Values a um pequeno número de Characters (tipicamente oito). Isso é um problema da System Library, não do MySQL. Para contorná-lo, altere seu MySQL Password para um valor que tenha oito Characters ou menos, ou insira seu Password em um Option File.