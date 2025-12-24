## 3.8 Atualização do MySQL com o Repositório MySQL Yum

Para plataformas baseadas em Yum suportadas (veja a Seção 2.5.1, Instalar MySQL no Linux Usando o Repositório MySQL Yum, para uma lista), você pode executar uma atualização no local para o MySQL (ou seja, substituindo a versão antiga e depois executando a nova versão usando os arquivos de dados antigos) com o repositório MySQL Yum.

::: info Notes

- Uma série de inovação, como o MySQL 9.5, está em uma faixa separada do que uma série LTS, como o MySQL 8.4.
- Antes de executar qualquer atualização para o MySQL, siga cuidadosamente as instruções no Capítulo 3, \* Atualização do MySQL\*. Entre outras instruções discutidas lá, é especialmente importante fazer backup do seu banco de dados antes da atualização.
- As instruções a seguir assumem que você instalou o MySQL com o repositório MySQL Yum ou com um pacote RPM baixado diretamente da página de download do MySQL Developer Zone; se não for esse o caso, siga as instruções em Substituir uma distribuição nativa de terceiros do MySQL.

:::

1. ### Seleção de uma série de alvo

   Por padrão, o repositório MySQL Yum atualiza o MySQL para a versão mais recente na faixa de lançamento que você escolheu durante a instalação (veja Seleção de uma Série de Lançamento para detalhes), o que significa, por exemplo, que uma instalação 8.0.x \* não \* é atualizada para uma versão 8.4.x automaticamente. Para atualizar para outra série de lançamento, você deve primeiro desativar o subrepositório para a série que foi selecionada (por padrão ou por si mesmo) e habilitar o subrepositório para sua série de destino. Para fazer isso, consulte as instruções gerais dadas em Seleção de uma Série de Lançamento para editar as entradas do subrepositório no arquivo `/etc/yum.repos.d/mysql-community.repo` .

   Como regra geral, para atualizar de uma série de correção de bugs para outra, vá para a próxima série de correção de bugs em vez de pular uma série de correção de bugs. Por exemplo, se você estiver executando o MySQL 5.7 e deseja atualizar para o MySQL 8.4, atualize para o MySQL 8.0 primeiro antes de atualizar para o MySQL 8.4.

   - Para informações importantes sobre a atualização do MySQL 5.7 para 8.0, consulte Atualização do MySQL 5.7 para 8.0.
   - Para informações importantes sobre a atualização do MySQL 8.0 para 8.4, consulte Atualização do MySQL 8.0 para 8.4.
   - O repositório MySQL Yum não suporta a degradação local do MySQL. Siga as instruções no Capítulo 4, *Downgrading MySQL*.
2. ### Atualização do MySQL

   Atualize os componentes MySQL usando comandos yum (ou dnf) padrão, como o MySQL Server:

   ```
   sudo yum update mysql-server
   ```

   Para plataformas habilitadas para dnf:

   ```
   sudo dnf upgrade mysql-server
   ```

   Alternativamente, você pode atualizar o MySQL dizendo ao Yum para atualizar tudo em seu sistema, o que pode levar consideravelmente mais tempo.

   ```
   sudo yum update
   ```

   Para plataformas habilitadas para dnf:

   ```
   sudo dnf upgrade
   ```

   ::: info Note

   O servidor MySQL sempre reinicia após uma atualização do Yum.

   :::

Você também pode atualizar apenas um componente específico. Use o seguinte comando para listar todos os pacotes instalados para os componentes do MySQL (para sistemas habilitados para dnf, substitua `yum` no comando por `dnf`):

```
sudo yum list installed | grep "^mysql"
```

Após identificar o nome do pacote do componente de sua escolha, atualize o pacote com o seguinte comando, substituindo `package-name` pelo nome do pacote. Para plataformas que não são dnf habilitadas:

```
sudo yum update package-name
```

Para plataformas habilitadas para dnf:

```
sudo dnf upgrade package-name
```

### Atualização das bibliotecas de clientes compartilhados

Após a atualização do MySQL usando o repositório Yum, os aplicativos compilados com versões mais antigas das bibliotecas de clientes compartilhados devem continuar a funcionar.

- Se você recompilar aplicativos e os vincular dinamicamente com as bibliotecas atualizadas:\* Como é típico com novas versões de bibliotecas compartilhadas onde há diferenças ou adições na versão de símbolos entre as bibliotecas mais recentes e mais antigas (por exemplo, entre as bibliotecas de clientes compartilhados mais recentes, padrão 8.4 e algumas versões mais antigas ou variantes das bibliotecas compartilhadas enviadas nativamente pelos repositórios de software das distribuições Linux, ou de algumas outras fontes), quaisquer aplicativos compilados usando as bibliotecas compartilhadas atualizadas mais recentes exigem essas bibliotecas atualizadas em sistemas onde os aplicativos são implantados. Como esperado, se essas bibliotecas não estiverem no lugar, os aplicativos que exigem as bibliotecas compartilhadas falham. Por esse motivo, certifique-se de instalar os pacotes para as bibliotecas compartilhadas a partir do MySQL nesses sistemas. Para fazer isso, adicione o repositório MySQL Yum aos sistemas (consulte Adicionar o Repositório MySQL Yum) e insta
