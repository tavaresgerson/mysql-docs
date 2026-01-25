### 5.1.2 Padrões de Configuração do Servidor

O MySQL server possui muitos *operating parameters* (parâmetros operacionais), que você pode alterar no *startup* do servidor usando *command-line options* ou *configuration files* (*option files*). Também é possível alterar muitos *parameters* em *runtime*. Para instruções gerais sobre como definir *parameters* no *startup* ou em *runtime*, consulte [Seção 5.1.6, “Opções de Comando do Servidor”](server-options.html "5.1.6 Server Command Options") e [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

No Windows, o MySQL Installer interage com o usuário e cria um arquivo chamado `my.ini` no *base installation directory* (diretório de instalação base) como o *default option file* (arquivo de opção padrão). Se você instalar no Windows a partir de um *Zip archive*, você pode copiar o arquivo de *template* `my-default.ini` no *base installation directory* para `my.ini` e usar este último como o *default option file*.

**Nota**
A partir do MySQL 5.7.18, o `my-default.ini` não está mais incluído ou é instalado pelos pacotes de distribuição.

**Nota**
No Windows, a extensão de *option file* `.ini` ou `.cnf` pode não ser exibida.

Após concluir o processo de instalação, você pode editar o *default option file* a qualquer momento para modificar os *parameters* utilizados pelo *server*. Por exemplo, para usar uma *setting* (configuração) de *parameter* no arquivo que está comentada com um caractere `#` no início da linha, remova o `#` e modifique o valor do *parameter* se necessário. Para desabilitar uma *setting*, adicione um `#` ao início da linha ou a remova.

Para *platforms* que não são Windows, nenhum *default option file* é criado durante a instalação do *server* ou o processo de inicialização do *data directory* (diretório de dados). Crie seu *option file* seguindo as instruções fornecidas em [Seção 4.2.2.2, “Utilizando Option Files”](option-files.html "4.2.2.2 Using Option Files"). Sem um *option file*, o *server* simplesmente inicia com suas *default settings* (configurações padrão) — veja [Seção 5.1.2, “Padrões de Configuração do Servidor”](server-configuration-defaults.html "5.1.2 Server Configuration Defaults") sobre como verificar essas *settings*.

Para informações adicionais sobre *format* e *syntax* de *option file*, consulte [Seção 4.2.2.2, “Utilizando Option Files”](option-files.html "4.2.2.2 Using Option Files").