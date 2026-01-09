#### B.3.2.4 Senha falha quando inserida interativamente

Os programas clientes do MySQL solicitam uma senha quando são invocados com a opção [`--password`](connection-options.html#option_general_password) ou `-p` sem um valor de senha subsequente:

```sql
$> mysql -u user_name -p
Enter password:
```

Em alguns sistemas, você pode descobrir que sua senha funciona quando especificada em um arquivo de opção ou na linha de comando, mas não quando você a digita interativamente no prompt `Digite a senha:`. Isso ocorre quando a biblioteca fornecida pelo sistema para ler senhas limita os valores da senha a um pequeno número de caracteres (tipicamente oito). Esse é um problema com a biblioteca do sistema, não com o MySQL. Para contornar isso, mude sua senha do MySQL para um valor que tenha oito ou menos caracteres, ou coloque sua senha em um arquivo de opção.
