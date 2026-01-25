#### 5.5.4.1 Instalando ou Desinstalando o Plugin de Rewrite de Query Rewriter

Nota

Se instalado, o plugin `Rewriter` envolve alguma sobrecarga (overhead) mesmo quando desabilitado. Para evitar essa sobrecarga, não instale o plugin a menos que você planeje usá-lo.

Para instalar ou desinstalar o plugin de rewrite de Query `Rewriter`, escolha o script apropriado localizado no diretório `share` de sua instalação MySQL:

* `install_rewriter.sql`: Escolha este script para instalar o plugin `Rewriter` e seus elementos associados.

* `uninstall_rewriter.sql`: Escolha este script para desinstalar o plugin `Rewriter` e seus elementos associados.

Execute o script escolhido da seguinte forma:

```sql
$> mysql -u root -p < install_rewriter.sql
Enter password: (enter root password here)
```

O exemplo aqui usa o script de instalação `install_rewriter.sql`. Substitua por `uninstall_rewriter.sql` se você estiver desinstalando o plugin.

A execução de um script de instalação deve instalar e habilitar o plugin. Para verificar isso, conecte-se ao server e execute esta instrução (statement):

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'rewriter_enabled';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| rewriter_enabled | ON    |
+------------------+-------+
```

Para instruções de uso, consulte [Seção 5.5.4.2, “Usando o Plugin de Rewrite de Query Rewriter”](rewriter-query-rewrite-plugin-usage.html "5.5.4.2 Usando o Plugin de Rewrite de Query Rewriter"). Para informações de referência, consulte [Seção 5.5.4.3, “Referência do Plugin de Rewrite de Query Rewriter”](rewriter-query-rewrite-plugin-reference.html "5.5.4.3 Referência do Plugin de Rewrite de Query Rewriter").