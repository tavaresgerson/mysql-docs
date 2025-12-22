#### 7.6.4.1 Instalar ou Desinstalar o Plugin Rewrite Query Rewriter

::: info Note

Se instalado, o plug-in `Rewriter` envolve alguma sobrecarga mesmo quando desativado. Para evitar esta sobrecarga, não instale o plugin a menos que você planeje usá-lo.

:::

Para instalar ou desinstalar o plug-in de reescrita de consulta `Rewriter`, escolha o script apropriado localizado no diretório `share` da sua instalação do MySQL:

- `install_rewriter.sql`: Escolha este script para instalar o plugin `Rewriter` e seus elementos associados.
- `uninstall_rewriter.sql`: Escolha este script para desinstalar o plugin `Rewriter` e seus elementos associados.

Execute o script escolhido da seguinte forma:

```
$> mysql -u root -p < install_rewriter.sql
Enter password: (enter root password here)
```

O exemplo aqui usa o script de instalação `install_rewriter.sql`. Substitua `uninstall_rewriter.sql` se você estiver desinstalar o plugin.

Executar um script de instalação deve instalar e ativar o plugin. Para verificar isso, conecte-se ao servidor e execute esta instrução:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'rewriter_enabled';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| rewriter_enabled | ON    |
+------------------+-------+
```

Para instruções de uso, consulte a Seção 7.6.4.2, "Utilizando o Plugin Rewrite Query" Para informações de referência, consulte a Seção 7.6.4.3, "Referência do Plugin Rewrite Query".
