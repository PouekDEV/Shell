@echo off
title Shell runner

:launch
cls
echo "          _____    _____                   _____                    _____                    _____                    _____                    _____                    _____                    _____          ";
echo "         /\    \  /\    \                 /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \         ";
echo "        /::\____\/::\    \               /::\____\                /::\____\                /::\    \                /::\____\                /::\    \                /::\____\                /::\    \        ";
echo "       /:::/    /::::\    \             /:::/    /               /::::|   |               /::::\    \              /:::/    /                \:::\    \              /::::|   |               /::::\    \       ";
echo "      /:::/    /::::::\    \           /:::/    /               /:::::|   |              /::::::\    \            /:::/    /                  \:::\    \            /:::::|   |              /::::::\    \      ";
echo "     /:::/    /:::/\:::\    \         /:::/    /               /::::::|   |             /:::/\:::\    \          /:::/    /                    \:::\    \          /::::::|   |             /:::/\:::\    \     ";
echo "    /:::/    /:::/__\:::\    \       /:::/    /               /:::/|::|   |            /:::/  \:::\    \        /:::/____/                      \:::\    \        /:::/|::|   |            /:::/  \:::\    \    ";
echo "   /:::/    /::::\   \:::\    \     /:::/    /               /:::/ |::|   |           /:::/    \:::\    \      /::::\    \                      /::::\    \      /:::/ |::|   |           /:::/    \:::\    \   ";
echo "  /:::/    /::::::\   \:::\    \   /:::/    /      _____    /:::/  |::|   | _____    /:::/    / \:::\    \    /::::::\    \   _____    ____    /::::::\    \    /:::/  |::|   | _____    /:::/    / \:::\    \  ";
echo " /:::/    /:::/\:::\   \:::\    \ /:::/____/      /\    \  /:::/   |::|   |/\    \  /:::/    /   \:::\    \  /:::/\:::\    \ /\    \  /\   \  /:::/\:::\    \  /:::/   |::|   |/\    \  /:::/    /   \:::\ ___\ ";
echo "/:::/____/:::/  \:::\   \:::\____\:::|    /      /::\____\/:: /    |::|   /::\____\/:::/____/     \:::\____\/:::/  \:::\    /::\____\/::\   \/:::/  \:::\____\/:: /    |::|   /::\____\/:::/____/  ___\:::|    |";
echo "\:::\    \::/    \:::\  /:::/    /:::|____\     /:::/    /\::/    /|::|  /:::/    /\:::\    \      \::/    /\::/    \:::\  /:::/    /\:::\  /:::/    \::/    /\::/    /|::|  /:::/    /\:::\    \ /\  /:::|____|";
echo " \:::\    \/____/ \:::\/:::/    / \:::\    \   /:::/    /  \/____/ |::| /:::/    /  \:::\    \      \/____/  \/____/ \:::\/:::/    /  \:::\/:::/    / \/____/  \/____/ |::| /:::/    /  \:::\    /::\ \::/    / ";
echo "  \:::\    \       \::::::/    /   \:::\    \ /:::/    /           |::|/:::/    /    \:::\    \                       \::::::/    /    \::::::/    /                   |::|/:::/    /    \:::\   \:::\ \/____/  ";
echo "   \:::\    \       \::::/    /     \:::\    /:::/    /            |::::::/    /      \:::\    \                       \::::/    /      \::::/____/                    |::::::/    /      \:::\   \:::\____\    ";
echo "    \:::\    \      /:::/    /       \:::\__/:::/    /             |:::::/    /        \:::\    \                      /:::/    /        \:::\    \                    |:::::/    /        \:::\  /:::/    /    ";
echo "     \:::\    \    /:::/    /         \::::::::/    /              |::::/    /          \:::\    \                    /:::/    /          \:::\    \                   |::::/    /          \:::\/:::/    /     ";
echo "      \:::\    \  /:::/    /           \::::::/    /               /:::/    /            \:::\    \                  /:::/    /            \:::\    \                  /:::/    /            \::::::/    /      ";
echo "       \:::\____\/:::/    /             \::::/    /               /:::/    /              \:::\____\                /:::/    /              \:::\____\                /:::/    /              \::::/    /       ";
echo "        \::/    /\::/    /               \::/____/                \::/    /                \::/    /                \::/    /                \::/    /                \::/    /                \::/____/        ";
echo "         \/____/  \/____/                 ~~                       \/____/                  \/____/                  \/____/                  \/____/                  \/____/                                  ";
echo " 
cls    
ping localhost-n 100000 >nul
echo " _______         _______ _       _       ";
echo "(  ____ \\     /(  ____ ( \     ( \      ";
echo "| (    \/ )   ( | (    \/ (     | (      ";
echo "| (_____| (___) | (__   | |     | |      ";
echo "(_____  )  ___  |  __)  | |     | |      ";
echo "      ) | (   ) | (     | |     | |      ";
echo "/\____) | )   ( | (____/\ (____/\ (____/\";
echo "\_______)/     \(_______(_______(_______/";
echo "                                         ";                                                                                                                                                                                                           ";
node bot.js
