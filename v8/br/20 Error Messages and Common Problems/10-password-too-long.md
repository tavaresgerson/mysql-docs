#### B.3.2.4 Senha não funciona quando inserida interativamente

Os programas cliente MySQL solicitam uma senha quando invocados com a opção `--password` ou `-p` que não tem um valor de senha subsequente:

```
$> mysql -u user_name -p
Enter password:
```

Em alguns sistemas, você pode descobrir que sua senha funciona quando especificada em um arquivo de opção ou na linha de comando, mas não quando você a insere interativamente no prompt `Digite a senha:`. Isso ocorre quando a biblioteca fornecida pelo sistema para ler senhas limita os valores de senha a um pequeno número de caracteres (tipicamente oito). Esse é um problema com a biblioteca do sistema, não com o MySQL. Para contornar isso, mude sua senha MySQL para um valor que tenha oito ou menos caracteres, ou coloque sua senha em um arquivo de opção.